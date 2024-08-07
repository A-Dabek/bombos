import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import '@angular/common/locales/global/pl';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BillsService, MoneyChangeItem } from '@bombos/data-access';
import { FloatingButtonComponent } from '@bombos/ui';
import { bounceInRightOnEnterAnimation } from 'angular-animations';
import { filter, of, switchMap, take, tap } from 'rxjs';
import { IconComponent } from '../../../../ui/src/lib/icon.component';
import { AmountComponent } from '../amount-form.component';
import { MoneyChangeListComponent } from '../money-change-list.component';
import { TimestampPipe } from '../timestamp.pipe';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-bills-view',
  imports: [
    AsyncPipe,
    DatePipe,
    TimestampPipe,
    IconComponent,
    MoneyChangeListComponent,
    AmountComponent,
    NgIf,
    FloatingButtonComponent,
  ],
  providers: [BillsService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: `
    <div class="relative h-screen">
      @for (period of periods$ | async; track period.id) {
      <div
        (click)="period.id !== openPeriodId() && openPeriod(period.id)"
        class="block max-w-sm p-6 py-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mb-2"
      >
        <div class="flex justify-between mb-2">
          <label class="capitalize font-semibold text-sm">
            20 {{ period.timestamp | timestamp | date : 'MMMM y' : '' : 'pl' }}
          </label>
        </div>
        @if (period.id === openPeriodId()) {
        <bombos-money-change-list
          [editable]="isAdmin"
          [items]="(periodItems$ | async) || []"
          [sum]="period.balance"
          (delete)="onItemDelete($event)"
        />
        <bombos-amount-form
          class="block mt-2 pb-3"
          (save)="onItemAdd($event)"
        />
        } @else {
        <bombos-money-change-list [sum]="period.balance" />
        }
      </div>
      }
    </div>
    <bombos-floating-button (clickEvent)="toggleAdmin()" />
  `,
})
export class BillsViewComponent implements OnInit {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';

  private readonly billsService = inject(BillsService);

  readonly periods$ = this.billsService.billPeriodItems$;
  readonly openPeriodId = signal('');
  readonly periodItems$ = toObservable(this.openPeriodId).pipe(
    switchMap((id) => {
      if (!id) return of([]);
      else
        return this.billsService.billItems$(id).pipe(
          tap((items) => {
            const sum = items.reduce((acc, next) => acc + next.amount, 0);
            this.billsService.updateBillPeriodBalance(id, sum);
          })
        );
    })
  );

  isAdmin = false;

  ngOnInit(): void {
    const today = new Date();
    const currentTimestamp =
      today.getFullYear() * 10 +
      today.getMonth() +
      (today.getDate() < 20 ? -1 : 0);
    this.billsService
      .currentBillPeriod(currentTimestamp)
      .pipe(
        take(1),
        filter((items) => items.length === 0)
      )
      .subscribe(() => {
        this.billsService.addBillPeriod({
          timestamp: currentTimestamp,
          balance: 0,
        });
      });
  }

  openPeriod(id: string) {
    this.openPeriodId.set(id);
  }

  onItemAdd(item: MoneyChangeItem) {
    this.billsService.addBillItem(this.openPeriodId(), item);
  }

  onItemDelete(id: string) {
    this.billsService.removeBillItem(this.openPeriodId(), id);
  }

  toggleAdmin() {
    this.isAdmin = !this.isAdmin;
  }
}

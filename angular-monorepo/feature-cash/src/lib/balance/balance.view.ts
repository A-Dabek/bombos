import { AsyncPipe, DatePipe, NgClass, NgIf } from '@angular/common';
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
import { BalanceService, MoneyChangeItem } from '@bombos/data-access';
import { FloatingButtonComponent, IconComponent } from '@bombos/ui';
import { bounceInRightOnEnterAnimation } from 'angular-animations';
import { filter, map, of, switchMap, take } from 'rxjs';
import { AmountComponent } from '../amount-form.component';
import { BalanceFormComponent } from '../balance-form.component';
import { MoneyChangeListComponent } from '../money-change-list.component';
import { MonthHeaderComponent } from '../month-header.component';
import { TimestampPipe } from '../timestamp.pipe';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-balance-view',
  imports: [
    AsyncPipe,
    DatePipe,
    TimestampPipe,
    IconComponent,
    MoneyChangeListComponent,
    NgClass,
    AmountComponent,
    NgIf,
    FloatingButtonComponent,
    BalanceFormComponent,
    MonthHeaderComponent,
  ],
  providers: [BalanceService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: `
    <div class="relative h-screen">
      @for (period of periods$ | async; track period.id; let last = $last) {
      <div
        (click)="openPeriod(period.id)"
        class="block max-w-sm p-6 py-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mb-2"
      >
        <bombos-month-header
          class="block mb-2"
          [periodTimestamp]="period.timestamp"
        />
        @if (period.id === openPeriodId()) {
        <bombos-money-change-list
          [editable]="isAdmin"
          [items]="(periodItems$ | async) || []"
          [autoSum]="true"
          (delete)="onItemDelete($event)"
        />
        <bombos-amount-form
          class="block mt-2 pb-3"
          label="Wydatek"
          (save)="onExpenseAdd($event)"
        />
        <bombos-balance-form
          *ngIf="!last && (isBalancePresent$ | async) === false"
          class="block mt-2 pb-3"
          (save)="onBalanceChange($event.amount)"
        />
        }
        <bombos-money-change-list
          sumLabel="Zostało na koncie"
          [sum]="period.balance"
        />
      </div>
      }
    </div>
    <bombos-floating-button (clickEvent)="toggleAdmin()" />
  `,
})
export class BalanceViewComponent implements OnInit {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';

  private readonly balanceService = inject(BalanceService);

  readonly periods$ = this.balanceService.balancePeriodItems$;
  readonly openPeriodId = signal('');
  readonly periodItems$ = toObservable(this.openPeriodId).pipe(
    switchMap((id) => {
      if (!id) return of([]);
      else return this.balanceService.balanceItems$(id);
    })
  );
  readonly isBalancePresent$ = this.periodItems$.pipe(
    map((items) => !!items.find((item) => item.amount > 0))
  );

  isAdmin = false;

  ngOnInit(): void {
    const today = new Date();
    const currentTimestamp =
      today.getFullYear() * 10 +
      today.getMonth() +
      (today.getDate() < 20 ? -1 : 0);
    this.balanceService
      .currentBalancePeriod(currentTimestamp)
      .pipe(
        take(1),
        filter((items) => items.length === 0)
      )
      .subscribe(() => {
        this.balanceService.addBalancePeriod({
          timestamp: currentTimestamp,
          balance: 0,
        });
      });
  }

  openPeriod(id: string) {
    id !== this.openPeriodId() && this.openPeriodId.set(id);
  }

  onExpenseAdd(item: MoneyChangeItem) {
    if (item.amount > 0) item.amount = -item.amount;
    this.balanceService.addBalanceItem(this.openPeriodId(), item);
  }

  onBalanceChange(amount: number) {
    this.balanceService.updateBalancePeriodBalance(this.openPeriodId(), amount);
  }

  onItemDelete(id: string) {
    this.balanceService.removeBalanceItem(this.openPeriodId(), id);
  }

  toggleAdmin() {
    this.isAdmin = !this.isAdmin;
  }
}

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
import { IconComponent } from '@bombos/ui';
import { bounceInRightOnEnterAnimation } from 'angular-animations';
import { filter, of, switchMap, take, tap } from 'rxjs';
import { AmountComponent } from '../amount-form.component';
import { MoneyChangeListComponent } from '../money-change-list.component';
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
  ],
  providers: [BalanceService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: `
    <div class="relative h-screen">
      @for (period of periods$ | async; track period.id) {
      <div
        class="block max-w-sm p-6 pt-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mb-2"
      >
        <div class="flex justify-between mb-2">
          <label class="capitalize font-semibold text-sm">
            {{ period.timestamp | timestamp | date : 'LLLL y' : '' : 'pl' }}
          </label>
          <button
            *ngIf="period.id !== openPeriodId()"
            class="px-2"
            (click)="openPeriod(period.id)"
          >
            <bombos-icon [name]="'eye'" />
          </button>
        </div>
        @if (period.id === openPeriodId()) {
        <bombos-money-change-list
          [items]="(periodItems$ | async) || []"
          (delete)="onItemDelete($event)"
        />
        }
        <hr class="my-2" />
        <div
          class="text-right font-semibold"
          [ngClass]="{
            'text-green-600 font-semibold': period.balance > 0,
            'text-red-700 font-semibold': period.balance < 0
          }"
        >
          ={{ period.balance }}
        </div>
        @if (period.id === openPeriodId()) {
        <hr class="my-3" />
        <bombos-amount-form (save)="onItemAdd($event)" />
        }
      </div>
      }
    </div>
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
      else
        return this.balanceService.balanceItems$(id).pipe(
          tap((items) => {
            const sum = items.reduce((acc, next) => acc + next.amount, 0);
            this.balanceService.updateBalancePeriodBalance(id, sum);
          })
        );
    })
  );

  ngOnInit(): void {
    const today = new Date();
    const currentTimestamp = today.getFullYear() * 10 + today.getMonth();
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
    this.openPeriodId.set(id);
  }

  onItemAdd(item: MoneyChangeItem) {
    this.balanceService.addBalanceItem(this.openPeriodId(), item);
  }

  onItemDelete(id: string) {
    this.balanceService.removeBalanceItem(this.openPeriodId(), id);
  }
}

import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
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
import { ReactiveFormsModule } from '@angular/forms';
import {
  BillsService,
  CashPlanService,
  MoneyChangeItem,
} from '@bombos/data-access';
import { FloatingButtonComponent, IconComponent } from '@bombos/ui';
import { bounceInRightOnEnterAnimation } from 'angular-animations';
import { filter, of, switchMap, take, tap, zip } from 'rxjs';
import { AmountComponent } from '../amount-form.component';
import { MoneyChangeListComponent } from '../money-change-list.component';
import { MonthHeaderComponent } from '../month-header.component';
import { TimestampPipe } from '../timestamp.pipe';
import { DefaultIncomeComponent } from './default-income.component';

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
    MonthHeaderComponent,
    NgForOf,
    ReactiveFormsModule,
    DefaultIncomeComponent,
  ],
  providers: [BillsService, CashPlanService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: `
    <div class="relative h-screen">
      <bombos-default-income
        class="block mb-2"
        [incomes]="(incomeItems$ | async) || []"
        [defaultValue]="(defaultIncome$ | async)?.ref || ''"
        (valueChange)="onIncomeChange($event)"
      />
      @for (period of periods$ | async; track period.id) {
      <div
        (click)="period.id !== openPeriodId() && openPeriod(period.id)"
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
  private readonly cashPlanService = inject(CashPlanService);

  readonly incomeItems$ = this.cashPlanService.incomeItems$;
  readonly defaultIncome$ = this.cashPlanService.planItemForBills$;

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
    this.createNewPeriodWithDefaultBalance();
  }

  private createNewPeriodWithDefaultBalance() {
    const today = new Date();
    const currentTimestamp =
      today.getFullYear() * 10 +
      today.getMonth() +
      (today.getDate() < 20 ? -1 : 0);
    zip(
      this.billsService.currentBillPeriod(currentTimestamp),
      this.defaultIncome$,
      this.incomeItems$
    )
      .pipe(
        take(1),
        filter(([currentPeriods]) => currentPeriods.length === 0),
        tap(([_, defaultIncome, incomeItems]) => {
          const income = incomeItems.find(
            (item) => item.id === defaultIncome?.ref
          );
          this.billsService.addBillPeriod(
            {
              timestamp: currentTimestamp,
              balance: 0,
            },
            income?.amount || 0
          );
        })
      )
      .subscribe();
  }

  onIncomeChange(id: string) {
    console.log('set');
    this.cashPlanService.setPlanItemForBills(id);
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

import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { CashPlanService, MoneyChangeItem } from '@bombos/data-access';
import { ConfirmButtonComponent, IconComponent } from '@bombos/ui';
import { bounceInRightOnEnterAnimation } from 'angular-animations';
import { map } from 'rxjs';
import { AmountComponent } from '../amount-form.component';
import { MoneyChangeListComponent } from '../money-change-list.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-plan-view',
  imports: [
    AsyncPipe,
    AmountComponent,
    NgClass,
    ConfirmButtonComponent,
    IconComponent,
    MoneyChangeListComponent,
  ],
  providers: [CashPlanService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: `
    <div class="relative h-screen">
      <div
        class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 mb-2"
      >
        <bombos-money-change-list
          [items]="(items$ | async) || []"
          (delete)="onItemDelete($event)"
        />
      </div>
      <div
        class="w-full max-w-sm px-6 py-4 bg-white border border-gray-200 rounded-lg shadow sm:p-3 md:p-3"
      >
        <bombos-amount-form (save)="onItemSave($event)" />
      </div>
    </div>
  `,
})
export class PlanViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';

  private readonly planService = inject(CashPlanService);

  readonly items$ = this.planService.planItems$;
  readonly sum$ = this.items$.pipe(
    map((items) => items.reduce((acc, curr) => curr.amount + acc, 0))
  );

  onItemSave(item: MoneyChangeItem) {
    this.planService.addPlanItem(item);
  }

  onItemDelete(id: string) {
    this.planService.removePlanItem(id);
  }
}

import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Id, MoneyChangeItem } from '@bombos/data-access';
import { ConfirmButtonComponent, IconComponent } from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-money-change-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConfirmButtonComponent, IconComponent, NgClass],
  template: `
    @for (item of items(); track item.id) {
    <div class="flex justify-between items-baseline mb-2">
      @if (editable()) {
      <bombos-confirm-button
        class="block me-2"
        (confirm)="delete.emit(item.id)"
      >
        <button
          class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2"
        >
          <bombos-icon name="delete" />
        </button>
      </bombos-confirm-button>
      }
      <span class="flex-grow">{{ item.name }}</span>
      <span
        [ngClass]="{
          'text-green-600 font-semibold': item.amount > 0,
          'text-red-700 font-semibold': item.amount < 0
        }"
        >{{ item.amount }}</span
      >
    </div>
    } @if (items().length > 0) {
    <hr class="my-3" />
    }
    <div class="flex justify-between font-semibold">
      <label>{{ sumLabel() }}</label>
      <div
        [ngClass]="{
          'text-green-600 font-semibold': calculatedSum() > 0,
          'text-red-700 font-semibold': calculatedSum() < 0
        }"
      >
        <span class="mr-2">=</span>{{ calculatedSum() }}
      </div>
    </div>
  `,
})
export class MoneyChangeListComponent {
  items = input<(MoneyChangeItem & Id)[]>([]);
  sum = input(0);
  editable = input(false);
  autoSum = input(false);
  sumLabel = input('');

  delete = output<string>();

  calculatedSum = computed(() => {
    return this.autoSum()
      ? this.items().reduce((acc, curr) => curr.amount + acc, 0)
      : this.sum();
  });
}

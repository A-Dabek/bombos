import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Id, MoneyChangeItem } from '@bombos/data-access';
import { ConfirmButtonComponent, IconComponent } from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-money-change-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConfirmButtonComponent, IconComponent, NgClass],
  template: `
    @for (item of items; track item.id) {
    <div class="flex justify-between mb-2">
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
      <span class="flex-grow">{{ item.name }}</span>
      <span
        [ngClass]="{
          'text-green-600 font-semibold': item.amount > 0,
          'text-red-700 font-semibold': item.amount < 0
        }"
        >{{ item.amount }}</span
      >
    </div>
    }
  `,
})
export class MoneyChangeListComponent {
  @Input() items: (MoneyChangeItem & Id)[] = [];

  @Output() delete = new EventEmitter();
}

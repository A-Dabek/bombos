import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ShoppingItem } from '@bombos/data-access';
import { ConfirmButtonComponent, IconComponent } from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="block">
      {{ item.name }}
      <span class="text-sm"> ({{ item.amount }}{{ item.unit }}) </span>
    </span>
    <span class="block text-xs">{{ item.description }}</span>
    @if (open) {
    <div
      class="flex max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
    >
      <div class="mr-2">
        <button
          (click)="edit.emit()"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center   "
        >
          <bombos-icon name="edit" />
        </button>
      </div>
      <bombos-confirm-button class="block" (confirm)="delete.emit()">
        <button
          class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2"
        >
          <bombos-icon name="delete" />
        </button>
      </bombos-confirm-button>
    </div>
    }
  `,
  imports: [ConfirmButtonComponent, IconComponent],
})
export class ListItemComponent {
  @Input({ required: true }) item!: ShoppingItem;
  @Input() open = false;

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
}

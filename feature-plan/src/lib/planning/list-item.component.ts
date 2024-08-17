import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { ShoppingItem } from '@bombos/data-access';
import { ConfirmButtonComponent, IconComponent } from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <span
      class="block mb-1"
      [ngClass]="{
        'text-red-800 font-medium underline': item().urgent && !item().bought,
        'line-through text-sm': item().bought,
      }"
    >
      {{ item().name }}
      @if (item().amount !== 1 || item().unit !== 'x') {
      <span class="text-sm"> ({{ item().amount }}{{ item().unit }}) </span>
      }
    </span>
    <span class="block text-xs">{{ item().description }}</span>
    @if (open()) {
    <div (click)="$event.stopPropagation()">
      <div class="flex">
        @if (item().amount > 1) {
        <button
          (click)="decrease.emit()"
          class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2 text-center"
        >
          <bombos-icon name="minus" />
        </button>
        }
        <button
          (click)="increase.emit()"
          class="ml-2 text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2 text-center"
        >
          <bombos-icon name="plus" />
        </button>
        <button
          (click)="edit.emit()"
          class="ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center"
        >
          <bombos-icon name="edit" />
        </button>
        <bombos-confirm-button class="block ml-2" (confirm)="delete.emit()">
          <button
            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2"
          >
            <bombos-icon name="delete" />
          </button>
        </bombos-confirm-button>
      </div>
    </div>
    }
  `,
  imports: [ConfirmButtonComponent, IconComponent, NgClass],
})
export class ListItemComponent {
  @HostBinding('class') readonly clazz = 'flex justify-between items-center';

  item = input.required<ShoppingItem>();
  open = input(false);
  highlight = input(0);

  edit = output();
  delete = output();
  increase = output();
  decrease = output();
}

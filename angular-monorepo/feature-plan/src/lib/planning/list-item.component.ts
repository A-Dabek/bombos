import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
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
    <span
      class="block mb-1"
      [ngClass]="{
        'text-red-800 font-medium underline': item.urgent && !item.bought,
        'line-through text-sm': item.bought,
        'font-semibold': highlight === 3,
        'font-bold': highlight === 2,
        'font-extrabold': highlight === 1
      }"
    >
      {{ item.name }}
      <span class="text-sm" *ngIf="item.amount !== 1 || item.unit !== 'x'">
        ({{ item.amount }}{{ item.unit }})
      </span>
    </span>
    <span class="block text-xs">{{ item.description }}</span>
    @if (open) {
    <div (click)="$event.stopPropagation()">
      <div class="flex">
        <button
          *ngIf="item.amount > 1"
          (click)="decrease.emit()"
          class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2 text-center"
        >
          <bombos-icon name="minus" />
        </button>
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
  imports: [ConfirmButtonComponent, IconComponent, NgIf, NgClass],
})
export class ListItemComponent {
  @HostBinding('class') readonly clazz = 'flex justify-between items-center';

  @Input({ required: true }) item!: ShoppingItem;
  @Input() open = false;
  @Input() highlight = 0;

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() increase = new EventEmitter();
  @Output() decrease = new EventEmitter();
}

import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Id, ShoppingItem } from '@bombos/data-access';
import { IconComponent } from '@bombos/ui';
import { ListItemComponent } from './list-item.component';

@Component({
  standalone: true,
  selector: 'bombos-list-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shopping-group flex">
      <div class="absolute -top-3 left-3 font-bold text-xs">
        {{ groupName }}
      </div>
      <ol class="flex-grow px-2">
        <li *ngFor="let item of items">
          <bombos-list-item
            class="block"
            [item]="item"
            [open]="openItemId === item.id"
            (click)="openEvent.emit(item.id)"
            (edit)="edit.emit(item)"
            (increase)="onIncrease(item)"
            (decrease)="onDecrease(item)"
            (delete)="delete.emit(item.id)"
          />
        </li>
      </ol>
      <button
        class="font-medium hover:underline px-3"
        (click)="groupAdd.emit()"
      >
        <bombos-icon name="plus" />
      </button>
    </div>
  `,
  imports: [ListItemComponent, NgForOf, IconComponent],
})
export class ListItemsComponent {
  @Input() items: (ShoppingItem & Id)[] = [];
  @Input() groupName = '';

  @Output() edit = new EventEmitter<ShoppingItem & Id>();
  @Output() delete = new EventEmitter<string>();

  @Input() openItemId = '';
  @Output() openEvent = new EventEmitter<string>();
  @Output() groupAdd = new EventEmitter();
  @Output() amountChange = new EventEmitter<ShoppingItem & Id>();

  onIncrease(item: ShoppingItem & Id) {
    this.amountChange.emit({ ...item, amount: item.amount + 1 });
  }

  onDecrease(item: ShoppingItem & Id) {
    this.amountChange.emit({ ...item, amount: item.amount - 1 });
  }
}

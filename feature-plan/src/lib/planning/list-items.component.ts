import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
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
        {{ groupName() }}
      </div>
      <ol class="flex-grow px-2">
        @for (item of items(); track item) {
        <li>
          <bombos-list-item
            class="block"
            [item]="item"
            [open]="openItemId() === item.id"
            (click)="openEvent.emit(item.id)"
            (edit)="edit.emit(item)"
            (increase)="onIncrease(item)"
            (decrease)="onDecrease(item)"
            (delete)="delete.emit(item.id)"
          />
        </li>
        }
      </ol>
      <button
        class="font-medium hover:underline px-3"
        (click)="groupAdd.emit()"
      >
        <bombos-icon name="plus" />
      </button>
    </div>
  `,
  imports: [ListItemComponent, IconComponent],
})
export class ListItemsComponent {
  items = input<(ShoppingItem & Id)[]>([]);
  groupName = input('');

  edit = output<ShoppingItem & Id>();
  delete = output<string>();

  openItemId = input('');
  openEvent = output<string>();
  groupAdd = output();
  amountChange = output<ShoppingItem & Id>();

  onIncrease(item: ShoppingItem & Id) {
    this.amountChange.emit({ ...item, amount: item.amount + 1 });
  }

  onDecrease(item: ShoppingItem & Id) {
    this.amountChange.emit({ ...item, amount: item.amount - 1 });
  }
}

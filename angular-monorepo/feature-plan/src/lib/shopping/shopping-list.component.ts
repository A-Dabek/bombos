import { KeyValuePipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Id, ShoppingItem } from '@bombos/data-access';
import { IconComponent } from '@bombos/ui';
import { ListItemComponent } from '../planning/list-item.component';
import { ListItemsComponent } from '../planning/list-items.component';

@Component({
  standalone: true,
  selector: 'bombos-shopping-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` @for (keyValue of groupedItems | keyvalue; track keyValue.key) {
    <div class="shopping-group">
      <div class="absolute -top-3 left-3 font-bold text-xs">
        {{ keyValue.key }}
      </div>
      <ol class="px-2">
        <li *ngFor="let item of keyValue.value">
          <bombos-list-item
            class="block"
            [item]="item"
            (click)="itemClick.emit(item)"
          />
        </li>
      </ol>
    </div>
    }`,
  imports: [
    KeyValuePipe,
    ListItemsComponent,
    IconComponent,
    ListItemComponent,
    NgForOf,
  ],
})
export class ShoppingListComponent {
  @Input() set items(value: (ShoppingItem & Id)[]) {
    this.groupedItems = value
      .sort((prev, curr) => {
        if (!!prev.bought === !!curr.bought) {
          return prev.name.localeCompare(curr.name);
        }
        return prev.bought ? 1 : -1;
      })
      .reduce((acc, item) => {
        const key = item.group;
        return { ...acc, [key]: [...(acc[key] || []), item] };
      }, {} as Record<string, (ShoppingItem & Id)[]>);
  }
  groupedItems: Record<string, (ShoppingItem & Id)[]> = {};

  @Output() itemClick = new EventEmitter<ShoppingItem & Id>();
}

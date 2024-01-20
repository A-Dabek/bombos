import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Id, ShoppingItem, ShoppingList } from '@bombos/data-access';
import { ConfirmButtonComponent, IconComponent } from '@bombos/ui';
import {
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { ListCardButtonsComponent } from './list-card-buttons.component';
import { ListItemFormComponent } from './list-item-form.component';
import { ListItemComponent } from './list-item.component';
import { ListItemsComponent } from './list-items.component';

@Component({
  standalone: true,
  selector: 'bombos-list-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    expandOnEnterAnimation({ anchor: 'enterDetails' }),
    collapseOnLeaveAnimation({ anchor: 'leaveDetails' }),
  ],
  template: `
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
      {{ list.name }}
    </h5>
    <div *ngIf="open" [@enterDetails] [@leaveDetails]>
      @if (isFormVisible) {
      <bombos-list-item-form
        class="block"
        [@enterDetails]
        [@leaveDetails]
        [groups]="['Fruit', 'Vegetables', 'Meat', 'Dairy', 'Bakery', 'Other']"
        [value]="formEditItem"
        (save)="onItemSave($event)"
        (cancel)="isFormVisible = false"
      />
      } @else { @for (keyValue of groupedItems | keyvalue; track keyValue.key) {
      <bombos-list-items
        [items]="keyValue.value"
        (edit)="onItemEdit($event)"
        (delete)="deleteItem.emit($event)"
      />
      }
      <bombos-list-card-buttons
        class="mt-2"
        [@enterDetails]
        [@leaveDetails]
        [boughtItemsPresent]="false"
        (newItem)="onNewItem()"
        (goShopping)="onGoShopping()"
        (clearItems)="onClearItems()"
      />
      }
    </div>
  `,
  imports: [
    RouterLink,
    NgIf,
    ConfirmButtonComponent,
    IconComponent,
    ListCardButtonsComponent,
    NgForOf,
    ListItemFormComponent,
    KeyValuePipe,
    ListItemComponent,
    ListItemsComponent,
  ],
})
export class ListCardComponent {
  @HostBinding('class') readonly clazz =
    'block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100';

  @Input({ required: true }) list!: ShoppingList & Id;
  @Input() open = false;
  @Input() set items(value: (ShoppingItem & Id)[]) {
    this.groupedItems = value.reduce((acc, item) => {
      const key = item.group;
      return { ...acc, [key]: [...(acc[key] || []), item] };
    }, {} as Record<string, (ShoppingItem & Id)[]>);
  }
  @Output() newItem = new EventEmitter<ShoppingItem>();
  @Output() editItem = new EventEmitter<ShoppingItem & Id>();
  @Output() deleteItem = new EventEmitter<string>();

  isFormVisible = false;
  groupedItems: Record<string, (ShoppingItem & Id)[]> = {};
  formEditItem?: ShoppingItem & Id;

  onNewItem() {
    this.isFormVisible = true;
  }

  onItemSave(item: ShoppingItem) {
    if (this.formEditItem) {
      this.editItem.emit({ ...item, id: this.formEditItem.id });
      this.formEditItem = undefined;
    } else {
      this.newItem.emit(item);
    }
  }

  onItemEdit(item: ShoppingItem & Id) {
    this.isFormVisible = true;
    this.formEditItem = item;
  }

  onGoShopping() {}

  onClearItems() {}
}

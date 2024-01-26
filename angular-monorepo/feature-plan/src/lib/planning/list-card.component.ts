import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { KeyValuePipe, NgIf } from '@angular/common';
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
    <h5
      class="flex justify-between align-baseline mb-2 text-2xl font-bold tracking-tight text-gray-900"
    >
      {{ list.name }}
      <ng-content></ng-content>
    </h5>
    <div
      *ngIf="open"
      [@enterDetails]
      [@leaveDetails]
      (click)="$event.stopPropagation()"
    >
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
        class="block mb-2"
        [openItemId]="openItemId"
        [items]="keyValue.value"
        (groupAdd)="onNewItem(keyValue.key)"
        (openEvent)="onItemOpen($event)"
        (edit)="onItemEdit($event)"
        (amountChange)="onItemAmountChange($event)"
        (delete)="deleteItem.emit($event)"
      />
      }
      <bombos-list-card-buttons
        class="mt-2"
        [@enterDetails]
        [@leaveDetails]
        [boughtItemsPresent]="false"
        [shoppingLink]="['shopping', list.id]"
        (newItem)="onNewItem()"
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
    ListItemFormComponent,
    KeyValuePipe,
    ListItemComponent,
    ListItemsComponent,
    CdkDrag,
    CdkDragHandle,
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
  formEditItem?: Partial<ShoppingItem & Id>;
  openItemId = '';

  onNewItem(group?: string) {
    this.isFormVisible = true;
    this.formEditItem = { group };
  }

  onItemSave(item: ShoppingItem) {
    this.openItemId = '';
    if (this.formEditItem?.id) {
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

  onItemAmountChange(item: ShoppingItem & Id) {
    this.editItem.emit(item);
  }

  onItemOpen(id: string) {
    this.openItemId = id === this.openItemId ? '' : id;
  }
  onClearItems() {}
}

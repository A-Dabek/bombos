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

@Component({
  standalone: true,
  selector: 'bombos-list-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    expandOnEnterAnimation({ anchor: 'enterDetails' }),
    collapseOnLeaveAnimation({ anchor: 'leaveDetails' }),
  ],
  template: `
    <style>
      ol:after {
        content: '';
        position: absolute;
        inset: -2px;
        border: 2px solid #0000;
        border-image: linear-gradient(90deg, #333333 5%, #0000 0 95%, #333333 0)
          10;
      }
    </style>
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
        (save)="onItemSave($event)"
        (cancel)="isFormVisible = false"
      />
      } @else { @for (keyValue of groupedItems | keyvalue; track keyValue.key) {
      <ol class="relative px-2 mb-2">
        <li *ngFor="let item of keyValue.value">
          <bombos-list-item [item]="item" />
        </li>
      </ol>
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
  ],
})
export class ListCardComponent {
  @HostBinding('class') readonly clazz =
    'block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100';

  @Input({ required: true }) list!: ShoppingList & Id;
  @Input() open = false;
  @Input() set items(value: ShoppingItem[]) {
    this.groupedItems = value.reduce((acc, item) => {
      const key = item.group;
      return { ...acc, [key]: [...(acc[key] || []), item] };
    }, {} as Record<string, ShoppingItem[]>);
  }
  @Output() newItem = new EventEmitter<ShoppingItem>();

  isFormVisible = false;
  groupedItems: Record<string, ShoppingItem[]> = {};

  onNewItem() {
    this.isFormVisible = true;
  }

  onItemSave(item: ShoppingItem) {
    this.newItem.emit(item);
  }

  onGoShopping() {}

  onClearItems() {}
}

import { NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
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
        (cancel)="isFormVisible = false"
      />
      } @else {
      <ol>
        <li *ngFor="let item of items">
          {{ item.name }}
        </li>
      </ol>

      <bombos-list-card-buttons
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
  ],
})
export class ListCardComponent {
  @HostBinding('class') readonly clazz =
    'block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100';

  @Input({ required: true }) list!: ShoppingList & Id;
  @Input() open = false;
  @Input() items: ShoppingItem[] = [];

  isFormVisible = false;

  onNewItem() {
    this.isFormVisible = true;
  }

  onGoShopping() {}

  onClearItems() {}
}

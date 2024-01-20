import { NgIf } from '@angular/common';
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
      <ol>
        <li *ngFor="let item of items">
          {{ item.name }}
        </li>
      </ol>

      <div class="flex flex-col justify-between">
        <button
          type="submit"
          class="mb-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center   "
        >
          <bombos-icon name="plus" />
        </button>
        <div class="flex w-full justify-between">
          <button
            class="flex-grow text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2"
          >
            <bombos-icon name="shopping" />
          </button>
          <bombos-confirm-button class="ml-1 flex-grow">
            <button
              class="w-full flex-grow focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2"
            >
              <!--            <bombos-icon name="list" />-->
              <bombos-icon name="planning-check" />
            </button>
          </bombos-confirm-button>
        </div>
      </div>
    </div>
  `,
  imports: [RouterLink, NgIf, ConfirmButtonComponent, IconComponent],
})
export class MealCardComponent {
  @HostBinding('class') readonly clazz =
    'block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100';

  @Input({ required: true }) list!: ShoppingList & Id;
  @Input() open = false;
  @Input() items: ShoppingItem[] = [];
}

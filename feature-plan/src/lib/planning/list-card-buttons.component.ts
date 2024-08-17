import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmButtonComponent, IconComponent } from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-list-card-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col justify-between">
      <button
        (click)="newItem.emit()"
        class="mb-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center   "
      >
        <bombos-icon name="plus" />
      </button>
      <div class="flex w-full justify-between">
        <button
          [routerLink]="shoppingLink"
          class="flex-grow text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2"
        >
          <bombos-icon name="shopping" />
        </button>
        <bombos-confirm-button
          class="ml-1 flex-grow"
          (confirm)="clearItems.emit()"
        >
          <button
            class="w-full flex-grow focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm p-2"
            [ngClass]="{
              'bg-red-700 hover:bg-red-800 focus:ring-red-300':
                !boughtItemsPresent,
              'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-800':
                boughtItemsPresent
            }"
          >
            @if (boughtItemsPresent) {
            <bombos-icon name="planning-check" />
            } @else {
            <bombos-icon name="list" />
            }
          </button>
        </bombos-confirm-button>
      </div>
    </div>
  `,
  imports: [RouterLink, NgIf, ConfirmButtonComponent, IconComponent, NgClass],
})
export class ListCardButtonsComponent {
  @HostBinding('class') readonly clazz = 'block "flex flex-col justify-between';

  @Input() boughtItemsPresent = false;
  @Input() shoppingLink = [] as unknown[];

  @Output() newItem = new EventEmitter();
  @Output() clearItems = new EventEmitter();
}

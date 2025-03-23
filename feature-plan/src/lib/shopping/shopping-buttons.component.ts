import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { Id, ShoppingItem } from '@bombos/data-access';
import { ConfirmButtonComponent, IconComponent } from '@bombos/ui';

@Component({
  selector: 'bombos-shopping-buttons',
  standalone: true,
  imports: [NgClass, IconComponent, ConfirmButtonComponent, NgIf],
  template: `
    <button
      *ngIf="currentGroup"
      class="flex-grow focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm p-2"
      [ngClass]="{
        'bg-blue-500 hover:bg-blue-600 focus:ring-blue-800': !isGroupFinished,
        'bg-green-500 hover:bg-green-600 focus:ring-green-800': isGroupFinished
      }"
      (click)="toggleFinished.emit(currentGroup)"
    >
      <bombos-icon [name]="'check'" />
    </button>
    <bombos-confirm-button (confirm)="clearItems.emit(items)">
      <button
        class="w-full flex-grow focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm p-2"
        [ngClass]="{
          'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-800': true
        }"
      >
        <bombos-icon name="planning-check" />
      </button>
    </bombos-confirm-button>
  `,
})
export class ShoppingButtonsComponent {
  @HostBinding('class') __ = 'flex justify-end gap-2 mb-2';
  @Input() currentGroup = '';
  @Input() isGroupFinished = false;
  @Input() items: (ShoppingItem & Id)[] = [];

  @Output() toggleFinished = new EventEmitter<string>();
  @Output() clearItems = new EventEmitter<(ShoppingItem & Id)[]>();
}

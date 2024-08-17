import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { shakeAnimation } from 'angular-animations';

@Component({
  standalone: true,
  selector: 'bombos-shopping-group-button',
  animations: [
    shakeAnimation({
      anchor: 'enterItem',
      duration: 500,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2"
      [ngClass]="{
        'bg-gray-900 text-white': active,
        'text-gray-900 bg-white ': !active
      }"
      (click)="itemClick.emit()"
    >
      <span
        *ngIf="urgentCount"
        class="bg-red-100 text-red-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"
      >
        {{ urgentCount }}
      </span>
      <span
        class="bg-gray-100 text-gray-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300"
      >
        {{ count }}
      </span>
      {{ groupKey || 'Brak' }}
    </button>
  `,
  imports: [NgClass, NgIf],
})
export class ShoppingGroupButton {
  @Input() groupKey = '';
  @Input() count = 0;
  @Input() urgentCount = 0;
  @Input() active = false;

  @Output() itemClick = new EventEmitter();
}

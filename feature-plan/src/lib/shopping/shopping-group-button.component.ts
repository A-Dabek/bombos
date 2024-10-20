import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
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
        'bg-gray-900 text-white': active(),
        'text-gray-900 bg-white': !active() && count() === 0,
        'text-gray-900 bg-blue-300': !active() && count() > 0,
      }"
      (click)="itemClick.emit()"
    >
      @if (urgentCount()) {
      <span
        class="bg-red-100 text-red-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"
      >
        {{ urgentCount() }}
      </span>
      } @if(count() > 0) {
      <span
        class="bg-gray-100 text-gray-800 text-xs font-medium me-1 px-1.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300"
      >
        {{ count() }}
      </span>
      }
      {{ groupKey() || 'Brak' }}
    </button>
  `,
  imports: [NgClass],
})
export class ShoppingGroupButton {
  readonly groupKey = input('');
  readonly count = input(0);
  readonly urgentCount = input(0);
  readonly active = input(false);

  readonly itemClick = output();
}

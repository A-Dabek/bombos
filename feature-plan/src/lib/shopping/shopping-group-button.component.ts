import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { shakeAnimation } from 'angular-animations';

@Component({
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
        'bg-gray-900 text-white': isActiveUnfinished(),
        'text-gray-900 bg-white': isInactiveEmptyUnfinished(),
        'text-gray-900 bg-blue-300': isInactiveWithItemsUnfinished(),
        'bg-green-600 text-white': isActiveFinished(),
        'bg-green-100 text-green-800': isInactiveFinished()
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
export class ShoppingGroupButtonComponent {
  readonly groupKey = input('');
  readonly count = input(0);
  readonly urgentCount = input(0);
  readonly active = input(false);
  readonly finished = input(false);

  readonly itemClick = output();
  readonly isActiveUnfinished = computed(
    () => this.active() && !this.finished()
  );

  readonly isInactiveEmptyUnfinished = computed(
    () => !this.active() && this.count() === 0 && !this.finished()
  );

  readonly isInactiveWithItemsUnfinished = computed(
    () => !this.active() && this.count() > 0 && !this.finished()
  );

  readonly isActiveFinished = computed(() => this.active() && this.finished());

  readonly isInactiveFinished = computed(
    () => !this.active() && this.finished()
  );
}

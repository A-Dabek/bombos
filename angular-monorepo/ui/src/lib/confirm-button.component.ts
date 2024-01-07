import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  standalone: true,
  selector: 'bombos-confirm-button',
  template: `
    <span *ngIf="!isConfirmationVisible()" (click)="intercept($event)">
      <ng-content></ng-content>
    </span>
    <button
      *ngIf="isConfirmationVisible()"
      type="button"
      class="focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm p-1 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-900"
      (click)="confirm.emit()"
    >
      <bombos-icon name="warning" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, NgIf],
})
export class ConfirmButtonComponent {
  isConfirmationVisible = signal(false);

  @Output() confirm = new EventEmitter();

  intercept(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isConfirmationVisible.set(true);
    setTimeout(() => this.isConfirmationVisible.set(false), 3000);
  }
}

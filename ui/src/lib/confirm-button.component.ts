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
      class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm p-2"
      (click)="onConfirm()"
    >
      <bombos-icon name="check" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, NgIf],
})
export class ConfirmButtonComponent {
  isConfirmationVisible = signal(false);

  @Output() confirm = new EventEmitter();
  private lastTimeoutId = 0;

  intercept(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isConfirmationVisible.set(true);
    this.lastTimeoutId = setTimeout(
      () => this.isConfirmationVisible.set(false),
      3000
    );
  }

  onConfirm() {
    clearTimeout(this.lastTimeoutId);
    this.isConfirmationVisible.set(false);
    this.confirm.emit();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  selector: 'bombos-confirm-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    @if (isConfirmationVisible()) {
    <button
      type="button"
      class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm p-2"
      (click)="onConfirm()"
    >
      <bombos-icon name="check" />
    </button>
    } @else {
    <span (click)="intercept($event)">
      <ng-content></ng-content>
    </span>
    }
  `,
})
export class ConfirmButtonComponent {
  isConfirmationVisible = signal(false);

  confirm = output();
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

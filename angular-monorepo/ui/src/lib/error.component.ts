import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'bombos-error',
  template: `
    <div
      class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  "
      role="alert"
    >
      {{ message }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  @Input() message = '';
}

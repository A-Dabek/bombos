import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'bombos-error',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` {{ message() }} `,
  host: {
    class: 'p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50',
  },
})
export class ErrorComponent {
  message = input('');
}

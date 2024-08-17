import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'bombos-error',
  template: ` {{ message }} `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  @HostBinding('class') _ =
    'p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50';

  @Input() message = '';
}

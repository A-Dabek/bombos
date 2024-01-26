import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';

@Component({
  standalone: true,
  selector: 'bombos-floating-button',
  template: `
    <button
      [routerLink]="link"
      class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2 me-2 mb-2"
    >
      <bombos-icon name="admin" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink],
})
export class FloatingButtonComponent {
  @HostBinding('class') _ = 'block fixed bottom-3 left-3';

  @Input() link = [] as unknown[];
}

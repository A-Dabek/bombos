import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  standalone: true,
  selector: 'bombos-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: {
    class: 'absolute w-full h-full bg-gray-600 bg-opacity-50 top-0 left-0',
  },
  template: `
    <bombos-icon
      class="inline-block relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      name="loading"
    />
  `,
})
export class LoadingComponent {}

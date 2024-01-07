import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  standalone: true,
  selector: 'bombos-loading',
  template: `
    <style>
      :host {
        display: contents;
      }
    </style>
    <div class="absolute w-full h-full" role="status">
      <bombos-icon
        class="inline-block relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        name="loading"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class LoadingComponent {}

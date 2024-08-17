import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';

@Component({
  selector: 'bombos-floating-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink],
  template: `
    @if(link().length > 0) {
    <button
      [routerLink]="link()"
      class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2 me-2 mb-2"
    >
      <bombos-icon name="admin" />
    </button>
    } @else {
    <button
      class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2 me-2 mb-2"
      (click)="clickEvent.emit()"
    >
      <bombos-icon name="admin" />
    </button>
    }
  `,
})
export class FloatingButtonComponent {
  @HostBinding('class') _ = 'block fixed bottom-3 left-3';

  link = input([] as unknown[]);
  clickEvent = output();
}

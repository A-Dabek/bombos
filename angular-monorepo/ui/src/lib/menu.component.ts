import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  bounceInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { IconComponent, IconType } from './icon.component';

export interface MenuItem {
  link: string;
  icon: IconType;
  label: string;
  notificationsCount: number;
}

@Component({
  standalone: true,
  selector: 'bombos-menu',
  template: `
    <div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
      <button
        *ngFor="let item of items; trackBy: itemTrackBy"
        [routerLink]="item.link"
        (click)="activeItem = item.link"
        type="button"
        class="relative inline-flex flex-col items-center justify-center px-5 border-x group hover:bg-gray-900 hover:text-white"
        [ngClass]="activeItem === item.link ? 'text-white bg-gray-900' : ''"
      >
        <bombos-icon class="mb-2" [name]="item.icon" />
        <div
          *ngIf="item.notificationsCount"
          [@enterNotification]
          [@leaveNotification]
          class="absolute right-1 top-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full"
        >
          {{ item.notificationsCount }}
        </div>
        <span class="text-sm">
          {{ item.label }}
        </span>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    bounceInOnEnterAnimation({ anchor: 'enterNotification' }),
    zoomOutOnLeaveAnimation({ anchor: 'leaveNotification' }),
  ],
  imports: [NgForOf, RouterLink, IconComponent, NgIf, NgClass],
})
export class MenuComponent {
  @HostBinding('class') _ =
    'block w-full h-16 bg-white border-t border-gray-200';

  @Input() items: MenuItem[] = [];

  activeItem = '';
  itemTrackBy = (index: number, item: MenuItem) => item.link;
}

import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
    <div
      class="w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600"
    >
      <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        <button
          *ngFor="let item of items"
          [routerLink]="item.link"
          (click)="activeItem = item.link"
          type="button"
          class="relative inline-flex flex-col items-center justify-center px-5 border-gray-200 border-x hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600"
        >
          <bombos-icon class="mb-2" [name]="item.icon" />
          <div
            *ngIf="item.notificationsCount && item.link !== activeItem"
            [@enterNotification]
            [@leaveNotification]
            class="absolute right-1 top-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900"
          >
            {{ item.notificationsCount }}
          </div>
          <span
            class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
          >
            {{ item.label }}
          </span>
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    bounceInOnEnterAnimation({ anchor: 'enterNotification' }),
    zoomOutOnLeaveAnimation({ anchor: 'leaveNotification' }),
  ],
  imports: [NgForOf, RouterLink, IconComponent, NgIf],
})
export class MenuComponent {
  @Input() items: MenuItem[] = [];

  activeItem = '';
}

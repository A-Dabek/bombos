import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
  bounceInOnEnterAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import { debounceTime, startWith } from 'rxjs';
import { IconComponent, IconType } from './icon.component';

export interface MenuItem {
  link: string;
  icon: IconType;
  label: string;
  notificationsCount: number;
}

@Component({
  selector: 'bombos-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    bounceInOnEnterAnimation({ anchor: 'enterNotification' }),
    zoomOutOnLeaveAnimation({ anchor: 'leaveNotification' }),
  ],
  imports: [RouterLink, IconComponent, NgClass],
  host: {
    class: 'block w-full h-16 bg-white border-t border-gray-200',
  },
  template: `
    <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
      @for (item of items(); track item.link) {
      <button
        [routerLink]="item.link"
        type="button"
        class="relative inline-flex flex-col items-center justify-center px-5 border-x group hover:bg-gray-900 hover:text-white"
        [ngClass]="activeItem() === item.link ? 'text-white bg-gray-900' : ''"
      >
        <bombos-icon class="mb-2" [name]="item.icon" />
        @if (item.notificationsCount) {
        <div
          [@enterNotification]
          [@leaveNotification]
          class="absolute right-1 top-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full"
        >
          {{ item.notificationsCount }}
        </div>
        }
        <span class="text-sm">
          {{ item.label }}
        </span>
      </button>
      }
    </div>
  `,
})
export class MenuComponent implements OnInit {
  readonly items = input<MenuItem[]>([]);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly activeItem = signal('');

  ngOnInit() {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(50),
        startWith({})
      )
      .subscribe(() => {
        const currentUrl = this.router.url.split('/')[1];
        if (!currentUrl) return;
        const item = this.items().find((tab) => tab.link.includes(currentUrl));
        if (!item) return;
        this.activeItem.set(item.link);
      });
  }
}

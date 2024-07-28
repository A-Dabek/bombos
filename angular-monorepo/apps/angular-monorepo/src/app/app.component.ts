import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DeliveryService, ShoppingService } from '@bombos/data-access';
import {
  ErrorComponent,
  ErrorService,
  MenuComponent,
  MenuItem,
} from '@bombos/ui';
import { Observable, combineLatest, filter, map, switchMap } from 'rxjs';
import { FirebaseModule } from '../firebase.module';

@Component({
  standalone: true,
  selector: 'bombos-root',
  imports: [
    RouterModule,
    FirebaseModule,
    ErrorComponent,
    NgIf,
    AsyncPipe,
    MenuComponent,
  ],
  providers: [ErrorService, DeliveryService, ShoppingService],
  template: `
    <bombos-menu *ngIf="menuItems$ | async as menuItems" [items]="menuItems" />
    <div class="p-1">
      <router-outlet></router-outlet>
      <bombos-error
        *ngIf="error$ | async as error"
        class="fixed bottom-0 left-0 z-50 w-full"
        [message]="error"
      />
    </div>
  `,
})
export class AppComponent {
  readonly error$ = inject(ErrorService).error$;
  private readonly deliveryService = inject(DeliveryService);
  private readonly shoppingService = inject(ShoppingService);

  menuItems$: Observable<MenuItem[]> = inject(Router).events.pipe(
    filter((event) => event instanceof NavigationEnd),
    switchMap(() => {
      return combineLatest([
        this.deliveryService.getTotalCount(),
        this.shoppingService.getUrgentCount(),
      ]).pipe(
        map(([deliveryCount, shoppingCount]) => {
          return [
            {
              link: '/deliveries',
              icon: 'delivery',
              label: 'Paczki',
              notificationsCount: deliveryCount,
            },
            {
              link: '/food',
              icon: 'cook',
              label: 'Jedzenie',
              notificationsCount: 0,
            },
            {
              link: '/cash',
              icon: 'cash',
              label: 'Finanse',
              notificationsCount: 0,
            },
            {
              link: '/plan',
              icon: 'planning',
              label: 'Zakupy',
              notificationsCount: shoppingCount,
            },
          ] as MenuItem[];
        })
      );
    })
  );
}

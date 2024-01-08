import {
  ErrorComponent,
  ErrorService,
  MenuComponent,
  MenuItem,
} from '@angular-monorepo/ui';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeliveryService } from '@bombos/data-access';
import { map, Observable, startWith } from 'rxjs';
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
  providers: [ErrorService, DeliveryService],
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

  menuItems$: Observable<MenuItem[]> = inject(DeliveryService)
    .getTotalCount()
    .pipe(
      startWith(0),
      map((count) => {
        return [
          {
            link: '/deliveries',
            icon: 'delivery',
            label: 'Post',
            notificationsCount: count,
          },
          {
            link: '/food',
            icon: 'cook',
            label: 'Food',
            notificationsCount: 0,
          },
          {
            link: '/',
            icon: 'planning',
            label: 'Plan',
            notificationsCount: 0,
          },
          {
            link: '/',
            icon: 'shopping',
            label: 'Shop',
            notificationsCount: 0,
          },
        ];
      })
    );
}

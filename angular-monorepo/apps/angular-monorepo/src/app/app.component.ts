import { ErrorComponent } from '@angular-monorepo/ui';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorService } from '../../../../ui/src/lib/error.service';
import { MenuComponent, MenuItem } from '../../../../ui/src/lib/menu.component';
import { FirebaseModule } from '../firebase.module';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    FirebaseModule,
    ErrorComponent,
    NgIf,
    AsyncPipe,
    MenuComponent,
  ],
  providers: [ErrorService],
  selector: 'bombos-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly errorService: ErrorService = inject(ErrorService);
  readonly error$ = this.errorService.error$;

  menuItems: MenuItem[] = [
    {
      link: '/deliveries',
      icon: 'delivery',
      label: 'Post',
    },
    {
      link: '/',
      icon: 'cook',
      label: 'Food',
    },
    {
      link: '/',
      icon: 'planning',
      label: 'Plan',
    },
    {
      link: '/',
      icon: 'shopping',
      label: 'Shop',
    },
  ];
}

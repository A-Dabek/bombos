import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { CanMatchFn, Route } from '@angular/router';
import { map, take } from 'rxjs';

const authGuard: CanMatchFn = () => {
  return user(inject(Auth)).pipe(
    take(1),
    map((user) => !!user)
  );
};

export const appRoutes: Route[] = [
  {
    path: 'deliveries',
    canMatch: [authGuard],
    loadChildren: () =>
      import('@bombos/deliveries').then((module) => module.ROUTES),
  },
  {
    path: 'food',
    canMatch: [authGuard],
    loadChildren: () =>
      import('@bombos/food').then((module) => module.FOOD_ROUTES),
  },
  {
    path: 'cash',
    canMatch: [authGuard],
    loadChildren: () =>
      import('@bombos/cash').then((module) => module.CASH_ROUTES),
  },
  {
    path: 'plan',
    canMatch: [authGuard],
    loadChildren: () =>
      import('@bombos/plan').then((module) => module.PLAN_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'plan',
  },
];

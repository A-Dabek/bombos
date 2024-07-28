import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'deliveries',
    loadChildren: () =>
      import('@bombos/deliveries').then((module) => module.ROUTES),
  },
  {
    path: 'food',
    loadChildren: () =>
      import('@bombos/food').then((module) => module.FOOD_ROUTES),
  },
  {
    path: 'cash',
    loadChildren: () =>
      import('@bombos/cash').then((module) => module.CASH_ROUTES),
  },
  {
    path: 'plan',
    loadChildren: () =>
      import('@bombos/plan').then((module) => module.PLAN_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'plan',
  },
];

import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'deliveries',
    loadComponent: () =>
      import('@bombos/deliveries').then(
        (module) => module.DeliveriesViewComponent
      ),
  },
  {
    path: 'food',
    loadComponent: () =>
      import('@bombos/food').then((module) => module.FoodViewComponent),
  },
];

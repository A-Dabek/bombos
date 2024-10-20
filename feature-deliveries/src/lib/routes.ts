import { Routes } from '@angular/router';
import { DeliveriesViewComponent } from './deliveries/deliveries.view';
import { DeliveryViewComponent } from './delivery/delivery.view';

export const ROUTES: Routes = [
  {
    path: ':tab',
    component: DeliveriesViewComponent,
  },
  {
    path: 'delivery/:type/:id',
    component: DeliveryViewComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'collect',
  },
];

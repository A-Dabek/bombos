import { Routes } from '@angular/router';
import { DeliveriesViewComponent } from './deliveries.view';
import { DeliveryViewComponent } from './delivery.view';

export const ROUTES: Routes = [
  {
    path: '',
    component: DeliveriesViewComponent,
  },
  {
    path: 'delivery/:type/:id',
    component: DeliveryViewComponent,
  },
];

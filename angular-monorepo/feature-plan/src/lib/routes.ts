import { Routes } from '@angular/router';
import { AdminPlanListViewComponent } from './admin/admin-plan-list.view';
import { PlanViewComponent } from './plan.view';
import { PlanListViewComponent } from './planning/plan-list.view';
import { ShoppingViewComponent } from './shopping/shopping.view';

export const PLAN_ROUTES: Routes = [
  {
    path: '',
    component: PlanViewComponent,
    children: [
      {
        path: '',
        component: PlanListViewComponent,
      },
      {
        path: 'admin',
        component: AdminPlanListViewComponent,
      },
      {
        path: 'shopping/:id',
        component: ShoppingViewComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

import { Routes } from '@angular/router';
import { AdminPlanListViewComponent } from './admin/admin-plan-list.view';
import { PlanListViewComponent } from './plan-list.view';
import { PlanViewComponent } from './plan.view';

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
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

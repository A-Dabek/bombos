import { Routes } from '@angular/router';
import { BalanceViewComponent } from './balance/balance.view';
import { BillsViewComponent } from './bills/bills.view';
import { CashViewComponent } from './cash.view';
import { PlanViewComponent } from './plan/plan.view';

export const CASH_ROUTES: Routes = [
  {
    path: '',
    component: CashViewComponent,
    children: [
      {
        path: 'plan',
        component: PlanViewComponent,
      },
      {
        path: 'bills',
        component: BillsViewComponent,
      },
      {
        path: 'balance',
        component: BalanceViewComponent,
      },
      {
        path: '**',
        redirectTo: 'plan',
        pathMatch: 'full',
      },
    ],
  },
];

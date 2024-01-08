import { Routes } from '@angular/router';
import { MealAdminViewComponent } from './admin/meal-admin.view';
import { MealsAdminViewComponent } from './admin/meals-admin.view';
import { FoodViewComponent } from './food.view';
import { MealViewComponent } from './meal.view';
import { MealsViewComponent } from './meals.view';

export const FOOD_ROUTES: Routes = [
  {
    path: '',
    component: FoodViewComponent,
    children: [
      {
        path: '',
        component: MealsViewComponent,
      },
      {
        path: 'admin',
        component: MealsAdminViewComponent,
      },
      {
        path: 'admin/:meal',
        component: MealAdminViewComponent,
      },
      {
        path: ':meal',
        component: MealViewComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

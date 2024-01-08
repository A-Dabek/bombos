import { Routes } from '@angular/router';
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

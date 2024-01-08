import { ErrorService, LoadingComponent } from '@angular-monorepo/ui';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FoodManagementService, FoodService, Meal } from '@bombos/data-access';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { Id } from '../../../data-access/src/lib/model';
import { MealCardComponent } from './meal-card.component';
import { MealFormComponent } from './meal-form.component';

@Component({
  standalone: true,
  selector: 'bombos-meals-view',
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <div [@enterView]>
      <bombos-meal-form class="block mb-2" (save)="onMealAdd($event)" />
      <ul>
        <li
          [@enterItem]
          [@leaveItem]
          *ngFor="let meal of foodService.meals$ | async; trackBy: mealTrackBy"
        >
          <bombos-meal-card
            class="block mb-2"
            [meal]="meal"
            [loading]="loadingMealId() === meal.id"
            (save)="onMealUpdate(meal.id, $event)"
            (delete)="onMealDelete(meal.id)"
          >
          </bombos-meal-card>
        </li>
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FoodService, FoodManagementService],
  imports: [
    MealCardComponent,
    MealFormComponent,
    AsyncPipe,
    NgForOf,
    NgIf,
    LoadingComponent,
  ],
})
export class MealsViewComponent {
  readonly foodService = inject(FoodService);
  readonly _adminFoodService = inject(FoodManagementService);
  private readonly errorService = inject(ErrorService);

  mealTrackBy = (_: number, meal: Meal & Id) => meal.id;
  loadingMealId = signal('');

  onMealAdd(payload: Meal) {
    this._adminFoodService.addMeal(payload).catch((error) => {
      this.errorService.raiseError(error.toString());
    });
  }

  onMealUpdate(mealId: string, meal: Meal) {
    this.loadingMealId.set(mealId);
    this._adminFoodService
      .updateMeal(mealId, meal)
      .catch((error) => {
        this.errorService.raiseError(error.toString());
      })
      .finally(() => this.loadingMealId.set(''));
  }

  onMealDelete(id: string) {
    this.loadingMealId.set(id);
    this._adminFoodService
      .removeMeal(id)
      .catch((error) => {
        this.errorService.raiseError(error.toString());
      })
      .finally(() => this.loadingMealId.set(''));
  }
}

import { ErrorService, LoadingComponent } from '@angular-monorepo/ui';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import {
  FoodManagementService,
  FoodService,
  Id,
  Meal,
} from '@bombos/data-access';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { MealAdminCardComponent } from './meal-admin-card.component';
import { MealFormComponent } from './meal-form.component';

@Component({
  standalone: true,
  selector: 'bombos-admin-meals-view',
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <bombos-meal-form class="block mb-2" (save)="onMealAdd($event)" />
    <ul>
      <li
        [@enterItem]
        [@leaveItem]
        *ngFor="let meal of foodService.meals$ | async; trackBy: mealTrackBy"
      >
        <bombos-admin-meal-card
          class="block mb-2"
          [meal]="meal"
          [loading]="loadingMealId() === meal.id"
          (save)="onMealUpdate(meal.id, $event)"
          (delete)="onMealDelete(meal.id)"
        >
        </bombos-admin-meal-card>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FoodService, FoodManagementService],
  imports: [
    MealAdminCardComponent,
    MealFormComponent,
    AsyncPipe,
    NgForOf,
    NgIf,
    LoadingComponent,
  ],
})
export class MealsAdminViewComponent {
  @HostBinding('@enterView') enterView = true;
  @HostBinding('class') class = 'block';

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

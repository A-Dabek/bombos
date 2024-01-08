import { ErrorService } from '@angular-monorepo/ui';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import { Dish, FoodManagementService, FoodService } from '@bombos/data-access';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { Observable, of } from 'rxjs';
import { Id } from '../../../data-access/src/lib/model';
import { DishCardComponent } from './dish-card.component';
import { DishFormComponent } from './dish-form.component';
import { MealCardComponent } from './meal-card.component';

@Component({
  standalone: true,
  selector: 'bombos-meal-view',
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <div [@enterView]>
      <bombos-dish-form class="block mb-2" (save)="onDishAdd($event)" />
      <ul>
        <li
          [@enterItem]
          [@leaveItem]
          *ngFor="let dish of dishes$ | async; trackBy: dishTrackBy"
        >
          <bombos-dish-card
            class="block mb-2"
            [dish]="dish"
            [loading]="loadingDishId() === dish.id"
            (save)="onDishUpdate(dish.id, $event)"
            (delete)="onDishDelete(dish.id)"
          />
        </li>
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FoodService, FoodManagementService],
  imports: [
    MealCardComponent,
    AsyncPipe,
    NgForOf,
    DishFormComponent,
    DishCardComponent,
  ],
})
export class MealViewComponent {
  readonly foodService = inject(FoodService);
  readonly _adminFoodService = inject(FoodManagementService);
  private readonly errorService = inject(ErrorService);

  private mealId = '';
  @Input({ required: true }) set meal(value: string) {
    this.dishes$ = this.foodService.getDishes(value);
    this.mealId = value;
  }

  dishes$: Observable<(Dish & Id)[]> = of([]);
  dishTrackBy = (_: number, dish: Dish & Id) => dish.id;
  loadingDishId = signal('');

  onDishAdd(payload: Dish) {
    this._adminFoodService.addDish(this.mealId, payload).catch((error) => {
      this.errorService.raiseError(error.toString());
    });
  }

  onDishUpdate(id: string, dish: Dish) {
    this.loadingDishId.set(id);
    this._adminFoodService
      .updateDish(this.mealId, id, dish)
      .catch((error) => {
        this.errorService.raiseError(error.toString());
      })
      .finally(() => this.loadingDishId.set(''));
  }

  onDishDelete(id: string) {
    this._adminFoodService.removeDish(this.mealId, id).catch((error) => {
      this.errorService.raiseError(error.toString());
    });
  }
}

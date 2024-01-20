import { AsyncPipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
  signal,
} from '@angular/core';
import {
  Dish,
  FoodManagementService,
  FoodService,
  Id,
} from '@bombos/data-access';
import { ErrorService } from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { Observable, of } from 'rxjs';
import { DishAdminCardComponent } from './dish-admin-card.component';
import { DishFormComponent } from './dish-form.component';
import { MealAdminCardComponent } from './meal-admin-card.component';

@Component({
  standalone: true,
  selector: 'bombos-admin-meal-view',
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <bombos-dish-form class="block mb-2" (save)="onDishAdd($event)" />
    <ul>
      <li
        [@enterItem]
        [@leaveItem]
        *ngFor="let dish of dishes$ | async; trackBy: dishTrackBy"
      >
        <bombos-admin-dish-card
          class="block mb-2"
          [dish]="dish"
          [loading]="loadingDishId() === dish.id"
          (save)="onDishUpdate(dish.id, $event)"
          (delete)="onDishDelete(dish.id)"
        />
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FoodService, FoodManagementService],
  imports: [
    MealAdminCardComponent,
    AsyncPipe,
    NgForOf,
    DishFormComponent,
    DishAdminCardComponent,
  ],
})
export class MealAdminViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') class = 'block';

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

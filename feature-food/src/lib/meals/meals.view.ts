import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FoodService, Id, Meal } from '@bombos/data-access';
import {
  FloatingButtonComponent,
  LoadingComponent,
  OrderManager,
} from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { MealCardComponent } from './meal-card.component';

@Component({
  standalone: true,
  selector: 'bombos-meals-view',
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FoodService],
  imports: [
    AsyncPipe,
    LoadingComponent,
    MealCardComponent,
    CdkDropList,
    CdkDrag,
    RouterLink,
    FloatingButtonComponent,
  ],
  template: `
    <div [@enterView]>
      @if (orderedMeals$ | async; as meals) {
      <ul
        cdkDropList
        [cdkDropListData]="meals"
        (cdkDropListDropped)="drop($event)"
      >
        @for (meal of meals; track mealTrackBy($index, meal)) {
        <li cdkDrag [@enterItem] [@leaveItem]>
          <bombos-meal-card
            class="block mb-2"
            [meal]="meal"
            [routerLink]="meal.id"
          />
        </li>
        }
      </ul>
      }
    </div>
    <bombos-floating-button [link]="['admin']" />
  `,
})
export class MealsViewComponent {
  @HostBinding('class') readonly clazz = 'block';

  private readonly foodService = inject(FoodService);
  private readonly orderManager = new OrderManager('overcooked_meals_order');

  orderedMeals$ = this.orderManager.order$(this.foodService.meals$);

  mealTrackBy = (_: number, meal: Meal & Id) => meal.id;

  drop(event: CdkDragDrop<(Meal & Id)[]>) {
    this.orderManager.reorder(event.previousIndex, event.currentIndex);
  }
}

import { LoadingComponent } from '@angular-monorepo/ui';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FoodService, Id, Meal } from '@bombos/data-access';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';

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
      <ul>
        <li
          [@enterItem]
          [@leaveItem]
          *ngFor="let meal of foodService.meals$ | async; trackBy: mealTrackBy"
        >
          <!--          <bombos-admin-meal-card-->
          <!--            class="block mb-2"-->
          <!--            [meal]="meal"-->
          <!--            [loading]="loadingMealId() === meal.id"-->
          <!--            (save)="onMealUpdate(meal.id, $event)"-->
          <!--            (delete)="onMealDelete(meal.id)"-->
          <!--          >-->
          <!--          </bombos-admin-meal-card>-->
        </li>
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FoodService],
  imports: [AsyncPipe, NgForOf, NgIf, LoadingComponent],
})
export class MealsViewComponent {
  readonly foodService = inject(FoodService);

  mealTrackBy = (_: number, meal: Meal & Id) => meal.id;
}

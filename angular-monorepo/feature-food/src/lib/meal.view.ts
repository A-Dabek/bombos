import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { Dish, FoodService, Id } from '@bombos/data-access';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { Observable, of } from 'rxjs';
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
      <ul cdkDropList (cdkDropListDropped)="drop($event)">
        <li
          cdkDrag
          [@enterItem]
          [@leaveItem]
          *ngFor="let dish of dishes$ | async; trackBy: dishTrackBy"
        >
          <!--          <bombos-admin-dish-card-->
          <!--            class="block mb-2"-->
          <!--            [dish]="dish"-->
          <!--            [loading]="loadingDishId() === dish.id"-->
          <!--            (save)="onDishUpdate(dish.id, $event)"-->
          <!--            (delete)="onDishDelete(dish.id)"-->
          <!--          />-->
        </li>
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FoodService],
  imports: [AsyncPipe, NgForOf, MealCardComponent, CdkDrag, CdkDropList],
})
export class MealViewComponent {
  readonly foodService = inject(FoodService);

  private mealId = '';
  @Input({ required: true }) set meal(value: string) {
    this.dishes$ = this.foodService.getDishes(value);
    this.mealId = value;
  }

  dishes$: Observable<(Dish & Id)[]> = of([]);
  dishTrackBy = (_: number, dish: Dish & Id) => dish.id;

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
  }
}

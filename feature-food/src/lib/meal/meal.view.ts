import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { Dish, FoodService } from '@bombos/data-access';
import { IconComponent } from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  pulseAnimation,
} from 'angular-animations';
import { BehaviorSubject, map, Observable, Subject, switchMap } from 'rxjs';
import { MealCardComponent } from '../meals/meal-card.component';
import { ABSURD_DISHES } from './absurd-dishes';
import { DishCardComponent } from './dish-card.component';

@Component({
  standalone: true,
  selector: 'bombos-meal-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, MealCardComponent, DishCardComponent, IconComponent],
  providers: [FoodService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    pulseAnimation({ anchor: 'reroll', direction: '=>', duration: 250 }),
  ],
  template: `
    @if (currentDish$ | async; as dish) {
    <bombos-dish-card
      class="w-full mb-2"
      [@reroll]="animateRollItem"
      (@reroll.done)="animateRollItem = false"
      [dish]="dish"
    />
    }
    <button
      class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2 text-center   "
      (click)="
        currentIndex$.next(currentIndex$.value + 1); animateRollItem = true
      "
    >
      <bombos-icon name="roll" />
    </button>
  `,
})
export class MealViewComponent {
  @HostBinding('@enterView') readonly enterView = true;
  @HostBinding('class') readonly clazz =
    'block flex flex-col items-center w-full';

  private readonly foodService = inject(FoodService);

  animateRollItem = false;
  currentDish$: Observable<Dish> = new Subject();
  currentIndex$ = new BehaviorSubject(0);

  @Input({ required: true }) set meal(value: string) {
    this.currentDish$ = this.getCurrentDish(value);
  }

  private getCurrentDish(meal: string): Observable<Dish> {
    return this.foodService.getDishes(meal).pipe(
      switchMap((dishes) => {
        const randomDishes = dishes.sort(() => Math.random() - 0.5);
        const randomAbsurdDishes = [...ABSURD_DISHES].sort(
          () => Math.random() - 0.5
        );
        return this.currentIndex$.pipe(
          map((index) =>
            Math.random() > 0.05
              ? randomDishes[index % dishes.length]
              : { name: randomAbsurdDishes[index % randomAbsurdDishes.length] }
          )
        );
      })
    );
  }
}

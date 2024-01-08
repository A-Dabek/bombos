import { IconComponent } from '@angular-monorepo/ui';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { Dish, FoodService, Id } from '@bombos/data-access';
import {
  bounceInRightOnEnterAnimation,
  pulseAnimation,
} from 'angular-animations';
import { BehaviorSubject, Observable, of, Subject, switchMap } from 'rxjs';
import { DishCardComponent } from './dish-card.component';
import { MealCardComponent } from './meal-card.component';

@Component({
  standalone: true,
  selector: 'bombos-meal-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgForOf,
    MealCardComponent,
    DishCardComponent,
    NgIf,
    IconComponent,
  ],
  providers: [FoodService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    pulseAnimation({ anchor: 'reroll', direction: '=>', duration: 250 }),
  ],
  template: `
    <bombos-dish-card
      *ngIf="currentDish$ | async as dish"
      class="w-full mb-2"
      [@reroll]="animateRollItem"
      (@reroll.done)="animateRollItem = false"
      [dish]="dish"
    />
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
  currentDish$: Observable<Dish & Id> = new Subject();
  currentIndex$ = new BehaviorSubject(0);

  @Input({ required: true }) set meal(value: string) {
    this.currentDish$ = this.foodService.getDishes(value).pipe(
      switchMap((dishes) => {
        const randomDishes = dishes.sort(() => Math.random() - 0.5);
        return this.currentIndex$.pipe(
          switchMap((index) => of(randomDishes[index % dishes.length]))
        );
      })
    );
  }
}

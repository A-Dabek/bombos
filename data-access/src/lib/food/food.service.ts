import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Id } from '../model';
import { Dish, Meal } from './model';

@Injectable()
export class FoodService {
  private firestore = inject(Firestore);
  private mealCollection = collection(this.firestore, 'overcooked_meals');

  meals$ = collectionData(this.mealCollection, { idField: 'id' }) as Observable<
    (Meal & Id)[]
  >;

  getDishes(mealId: string) {
    return collectionData(collection(this.mealCollection, mealId, 'dishes'), {
      idField: 'id',
    }) as Observable<(Dish & Id)[]>;
  }
}

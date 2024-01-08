import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { Dish, Meal } from './model';

@Injectable()
export class FoodManagementService {
  private firestore = inject(Firestore);
  private mealCollection = collection(this.firestore, 'overcooked_meals');

  addMeal(payload: Meal) {
    return addDoc(this.mealCollection, payload);
  }

  updateMeal(mealId: string, payload: Meal) {
    return updateDoc(doc(this.mealCollection, mealId), { ...payload });
  }

  removeMeal(mealId: string) {
    return deleteDoc(doc(this.mealCollection, mealId));
  }

  addDish(mealId: string, payload: Dish) {
    return addDoc(collection(this.mealCollection, mealId, 'dishes'), payload);
  }

  updateDish(mealId: string, dishId: string, payload: Dish) {
    return updateDoc(
      doc(collection(this.mealCollection, mealId, 'dishes'), dishId),
      { ...payload }
    );
  }

  removeDish(mealId: string, dishId: string) {
    return deleteDoc(
      doc(collection(this.mealCollection, mealId, 'dishes'), dishId)
    );
  }
}

import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Id } from '../model';
import { ShoppingItem, ShoppingList } from './model';

@Injectable()
export class ShoppingService {
  private firestore = inject(Firestore);
  private listCollection = collection(this.firestore, 'shopaholic_lists');

  lists$ = collectionData(this.listCollection, { idField: 'id' }) as Observable<
    (ShoppingList & Id)[]
  >;

  listItems$(listId: string) {
    return collectionData(collection(this.listCollection, listId, 'items'), {
      idField: 'id',
    }) as Observable<(ShoppingItem & Id)[]>;
  }

  addList(payload: ShoppingList) {
    return addDoc(this.listCollection, payload);
  }

  addItem(listId: string, payload: ShoppingItem) {
    return addDoc(collection(this.listCollection, listId, 'items'), payload);
  }

  updateItem(listId: string, itemId: string, payload: ShoppingItem) {
    return updateDoc(
      doc(collection(this.listCollection, listId, 'items'), itemId),
      { ...payload }
    );
  }

  deleteItem(listId: string, itemId: string) {
    return deleteDoc(
      doc(collection(this.listCollection, listId, 'items'), itemId)
    );
  }
}

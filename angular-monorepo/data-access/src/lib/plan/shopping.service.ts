import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionCount,
  collectionData,
  collectionGroup,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Id } from '../model';
import { ShoppingItem, ShoppingItemGroupIndex, ShoppingList } from './model';

@Injectable()
export class ShoppingService {
  private firestore = inject(Firestore);
  private listCollection = collection(this.firestore, 'shopaholic_lists');
  private groupIndexCollection = collection(
    this.firestore,
    'shopaholic_groups'
  );
  private itemsCollectionGroup = collectionGroup(this.firestore, 'items');

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

  updateList(listId: string, payload: ShoppingList) {
    return updateDoc(doc(this.listCollection, listId), { ...payload });
  }

  deleteList(listId: string) {
    return deleteDoc(doc(this.listCollection, listId));
  }

  getSuggestedGroup(itemName: string) {
    const escapedName = encodeURIComponent(itemName);
    return docData(doc(this.groupIndexCollection, itemName));
  }

  addItem(listId: string, payload: ShoppingItem) {
    if (payload.group) this.rememberGroup(payload.name, payload.group);
    return addDoc(collection(this.listCollection, listId, 'items'), payload);
  }

  private rememberGroup(name: string, group: string) {
    const escapedName = encodeURIComponent(name);
    const groupIndex: ShoppingItemGroupIndex = {
      [group]: 1,
    };
    setDoc(doc(this.groupIndexCollection, escapedName), groupIndex);
  }

  updateItem(listId: string, itemId: string, payload: Partial<ShoppingItem>) {
    if (payload.name && payload.group)
      this.rememberGroup(payload.name, payload.group);
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

  getUrgentCount(): Observable<number> {
    return collectionCount(
      query(this.itemsCollectionGroup, where('urgent', '==', true))
    );
  }
}

import { inject } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Id } from '../model';
import { Delivery } from './model';

export abstract class DeliveryService {
  protected firestore = inject(Firestore);
  protected collection;
  deliveries$: Observable<(Delivery & Id)[]>;

  protected constructor(collectionName: string) {
    this.collection = collection(this.firestore, collectionName);
    this.deliveries$ = collectionData(this.collection, {
      idField: 'id',
    }) as Observable<(Delivery & Id)[]>;
  }

  add(delivery: Delivery) {
    return addDoc(this.collection, delivery);
  }

  complete(id: string) {
    return deleteDoc(doc(this.collection, id));
  }
}

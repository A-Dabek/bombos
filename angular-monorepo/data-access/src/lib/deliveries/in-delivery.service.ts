import { inject, Injectable } from '@angular/core';
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
import { DeliveryService } from './delivery.service';
import { Delivery } from './model';

@Injectable()
export class InDeliveryService implements DeliveryService {
  private firestore = inject(Firestore);
  private collection = collection(this.firestore, 'delivery_in');

  deliveries$ = collectionData(this.collection, {
    idField: 'id',
  }) as Observable<(Delivery & Id)[]>;

  add(delivery: Delivery) {
    addDoc(this.collection, delivery).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  complete(id: string) {
    deleteDoc(doc(this.collection, id));
  }
}

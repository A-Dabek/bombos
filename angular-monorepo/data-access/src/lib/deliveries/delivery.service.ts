import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionCount,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
} from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';
import { combineLatest, map, Observable } from 'rxjs';
import { Id } from '../model';
import { Delivery } from './model';

export interface DeliveryStore {
  deliveries$: Observable<(Delivery & Id)[]>;
  add(delivery: Delivery): Promise<unknown>;
  updateAlias(id: string, alias: string): Promise<unknown>;
  complete(id: string): Promise<unknown>;
  getDelivery(id: string): Observable<Delivery & Id>;
}

@Injectable()
export class DeliveryService {
  private firestore = inject(Firestore);
  private collectionIn = collection(this.firestore, 'delivery_in');
  private collectionOut = collection(this.firestore, 'delivery_out');

  getDeliveriesStore(type: 'in' | 'out'): DeliveryStore {
    const collection = type === 'in' ? this.collectionIn : this.collectionOut;
    return {
      deliveries$: collectionData(collection, {
        idField: 'id',
      }) as Observable<(Delivery & Id)[]>,
      add: (delivery: Delivery) => addDoc(collection, delivery),
      complete: (id: string) => deleteDoc(doc(collection, id)),
      updateAlias: (id: string, alias: string) =>
        updateDoc(doc(collection, id), { alias }),
      getDelivery: (id: string) =>
        docData(doc(collection, id), {
          idField: 'id',
        }) as Observable<Delivery & Id>,
    };
  }

  getTotalCount(): Observable<number> {
    return combineLatest([
      collectionCount(this.collectionIn),
      collectionCount(this.collectionOut),
    ]).pipe(map(([inData, outData]) => inData + outData));
  }
}

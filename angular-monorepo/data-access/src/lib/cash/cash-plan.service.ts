import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Id } from '../model';
import { CashPlanItem } from './model';

@Injectable()
export class CashPlanService {
  private firestore = inject(Firestore);
  private planCollection = collection(this.firestore, 'cash_plan');

  readonly planItems$ = collectionData(
    query(this.planCollection, orderBy('name', 'asc')),
    {
      idField: 'id',
    }
  ) as Observable<(CashPlanItem & Id)[]>;

  addPlanItem(payload: CashPlanItem) {
    return addDoc(this.planCollection, payload);
  }

  removePlanItem(id: string) {
    return deleteDoc(doc(this.planCollection, id));
  }
}

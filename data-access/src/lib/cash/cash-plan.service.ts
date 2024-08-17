import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Id } from '../model';
import { CashPlanItem } from './model';

@Injectable()
export class CashPlanService {
  private firestore = inject(Firestore);
  private planCollection = collection(this.firestore, 'cash_plan');
  private metaCollection = collection(this.firestore, 'cash_meta');

  readonly planItems$ = collectionData(
    query(this.planCollection, orderBy('name', 'asc')),
    {
      idField: 'id',
    }
  ) as Observable<(CashPlanItem & Id)[]>;

  readonly incomeItems$ = collectionData(
    query(this.planCollection, orderBy('name', 'asc'), where('amount', '>', 0)),
    {
      idField: 'id',
    }
  ) as Observable<(CashPlanItem & Id)[]>;

  readonly planItemForBills$ = docData(
    doc(this.metaCollection, 'for_bills')
  ) as Observable<{ ref: string }>;

  addPlanItem(payload: CashPlanItem) {
    return addDoc(this.planCollection, payload);
  }

  removePlanItem(id: string) {
    return deleteDoc(doc(this.planCollection, id));
  }

  setPlanItemForBills(id: string) {
    return setDoc(doc(this.metaCollection, 'for_bills'), { ref: id });
  }
}

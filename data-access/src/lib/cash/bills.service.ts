import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Id } from '../model';
import { BillItem, BillsPeriodItem } from './model';

@Injectable()
export class BillsService {
  private firestore = inject(Firestore);
  private billPeriodsCollection = collection(this.firestore, 'cash_bills');

  readonly billPeriodItems$ = collectionData(
    query(this.billPeriodsCollection, orderBy('timestamp', 'desc')),
    {
      idField: 'id',
    }
  ) as Observable<(BillsPeriodItem & Id)[]>;

  async addBillPeriod(payload: BillsPeriodItem, income = 0) {
    if (income) payload.balance = income;
    const docRef = await addDoc(this.billPeriodsCollection, payload);
    if (!income) return;
    this.addBillItem(docRef.id, { name: 'Wpływy', amount: income });
  }

  updateBillPeriodBalance(id: string, balance: number) {
    return updateDoc(doc(this.billPeriodsCollection, id), { balance });
  }

  currentBillPeriod(timestamp: number) {
    return collectionData(
      query(this.billPeriodsCollection, where('timestamp', '==', timestamp))
    ) as Observable<BillsPeriodItem[]>;
  }

  billItems$(billPeriodId: string) {
    return collectionData(
      query(
        collection(this.billPeriodsCollection, billPeriodId, 'items'),
        orderBy('amount', 'desc')
      ),
      {
        idField: 'id',
      }
    ) as Observable<(BillItem & Id)[]>;
  }

  addBillItem(billPeriodId: string, payload: BillItem) {
    return addDoc(
      collection(this.billPeriodsCollection, billPeriodId, 'items'),
      payload
    );
  }

  removeBillItem(billPeriodId: string, billItemId: string) {
    return deleteDoc(
      doc(this.billPeriodsCollection, billPeriodId, 'items', billItemId)
    );
  }
}

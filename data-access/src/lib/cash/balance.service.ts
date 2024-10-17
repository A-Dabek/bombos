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
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Id } from '../model';
import { BalanceItem, BalancePeriodItem } from './model';

@Injectable()
export class BalanceService {
  private firestore = inject(Firestore);
  private balancePeriodsCollection = collection(this.firestore, 'cash_balance');

  readonly balancePeriodItems$ = collectionData(
    query(this.balancePeriodsCollection, orderBy('timestamp', 'desc')),
    {
      idField: 'id',
    }
  ) as Observable<(BalancePeriodItem & Id)[]>;

  addBalancePeriod(payload: BalancePeriodItem) {
    return addDoc(this.balancePeriodsCollection, payload);
  }

  updateBalancePeriodBalance(id: string, balance: number) {
    return updateDoc(doc(this.balancePeriodsCollection, id), { balance });
  }

  currentBalancePeriod(timestamp: number) {
    return collectionData(
      query(this.balancePeriodsCollection, where('timestamp', '==', timestamp))
    ) as Observable<BalancePeriodItem[]>;
  }

  balanceItems$(balancePeriodId: string) {
    return collectionData(
      query(
        collection(this.balancePeriodsCollection, balancePeriodId, 'items'),
        orderBy('amount', 'desc')
      ),
      {
        idField: 'id',
      }
    ) as Observable<(BalanceItem & Id)[]>;
  }

  addBalanceItem(balancePeriodId: string, payload: BalanceItem) {
    return addDoc(
      collection(this.balancePeriodsCollection, balancePeriodId, 'items'),
      payload
    );
  }

  removeBalanceItem(balancePeriodId: string, balanceItemId: string) {
    return deleteDoc(
      doc(
        this.balancePeriodsCollection,
        balancePeriodId,
        'items',
        balanceItemId
      )
    );
  }
}

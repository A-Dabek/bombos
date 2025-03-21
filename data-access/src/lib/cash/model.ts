export interface MoneyChangeItem {
  name: string;
  amount: number;
}

export type CashPlanItem = MoneyChangeItem;

export interface BillsPeriodItem {
  timestamp: number;
  balance: number;
}

export type BillItem = MoneyChangeItem;

export interface BalancePeriodItem {
  timestamp: number;
  balance: number;
}

export type BalanceItem = MoneyChangeItem;

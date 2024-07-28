export interface MoneyChangeItem {
  name: string;
  amount: number;
}

export interface CashPlanItem extends MoneyChangeItem {}

export interface BillsPeriodItem {
  timestamp: number;
  balance: number;
}

export interface BillItem extends MoneyChangeItem {}

export interface BalancePeriodItem {
  timestamp: number;
  balance: number;
}

export interface BalanceItem extends MoneyChangeItem {}

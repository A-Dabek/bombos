export interface ShoppingList {
  name: string;
}
export interface ShoppingItem {
  name: string;
  amount: number;
  unit: string;
  description: string;
  urgent: boolean;
  group: string;
  bought?: boolean;
}

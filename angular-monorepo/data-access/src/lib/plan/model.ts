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
export type ShoppingItemGroupIndex = Record<string, number>;

export const shoppingGroups = [
  'Fruit',
  'Vegetables',
  'Meat',
  'Dairy',
  'Bakery',
  'Frozen',
  'Cosmetics',
  'Other',
];

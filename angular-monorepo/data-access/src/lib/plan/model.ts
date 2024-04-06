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
  'Owoce',
  'Warzywa',
  'Mięso',
  'Nabiał',
  'Pieczywo',
  'Mrożonki',
  'Kosmetyczne',
  'Inne',
];

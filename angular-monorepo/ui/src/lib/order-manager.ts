import { Id } from '@bombos/data-access';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

export class OrderManager {
  private readonly reorder$ = new BehaviorSubject(null);
  constructor(private readonly key: string) {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  private getOrder(): string[] {
    return JSON.parse(localStorage.getItem(this.key) ?? '[]');
  }

  private setOrder(order: string[]): void {
    localStorage.setItem(this.key, JSON.stringify(order));
  }

  private sanitizeOrder(order: string[], items: string[]): string[] {
    return order.filter((item) => items.includes(item));
  }

  reorder(previous: number, current: number): void {
    const order = this.getOrder();
    const newOrder = [...order];
    newOrder.splice(current, 0, newOrder.splice(previous, 1)[0]);
    this.setOrder(newOrder);
    this.reorder$.next(null);
  }

  order<T extends Id>(items: T[]): T[] {
    const order = this.getOrder();
    const sanitizedOrder = this.sanitizeOrder(
      order,
      items.map((item) => item.id)
    );
    const newItems = [...items];
    newItems.sort(
      (a, b) => sanitizedOrder.indexOf(a.id) - sanitizedOrder.indexOf(b.id)
    );
    const newOrder = newItems.map((item) => item.id);
    this.setOrder(newOrder);
    return newItems;
  }

  order$<T extends Id>(items$: Observable<T[]>): Observable<T[]> {
    return combineLatest([items$, this.reorder$]).pipe(
      map(([items]) => this.order(items))
    );
  }
}

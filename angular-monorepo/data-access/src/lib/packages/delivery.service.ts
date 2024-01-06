import { Observable } from 'rxjs';
import { Delivery } from './model';

export interface DeliveryService {
  deliveries$: Observable<Delivery[]>;

  add(delivery: Delivery): void;

  complete(id: string): void;
}

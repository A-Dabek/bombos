import { Observable } from 'rxjs';
import { Id } from '../model';
import { Delivery } from './model';

export interface DeliveryService {
  deliveries$: Observable<(Delivery & Id)[]>;

  add(delivery: Delivery): void;

  complete(id: string): void;
}

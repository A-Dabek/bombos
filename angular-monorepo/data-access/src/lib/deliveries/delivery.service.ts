import { Observable } from 'rxjs';
import { Id } from '../model';
import { Delivery } from './model';

export interface DeliveryService {
  deliveries$: Observable<(Delivery & Id)[]>;

  add(delivery: Delivery): Promise<unknown>;

  complete(id: string): Promise<unknown>;
}

import { Injectable } from '@angular/core';
import { DeliveryService } from './delivery.service';

@Injectable()
export class OutDeliveryService extends DeliveryService {
  constructor() {
    super('delivery_out');
  }
}

import { Injectable } from '@angular/core';
import { DeliveryService } from './delivery.service';

@Injectable()
export class InDeliveryService extends DeliveryService {
  constructor() {
    super('delivery_in');
  }
}
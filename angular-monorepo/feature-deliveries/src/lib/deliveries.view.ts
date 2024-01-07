import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Delivery,
  DeliveryService,
  InDeliveryService,
} from '@bombos/data-access';
import { AddFormComponent } from './add-form.component';
import { DeliveryCardComponent } from './delivery-card.component';
import { NavigationTabsComponent } from './navigation-tabs.component';
import { UploadFileComponent } from './upload-file.component';

@Component({
  standalone: true,
  selector: 'bombos-deliveries-view',
  template: `
    <bombos-navigation-tabs />
    <bombos-upload-file (upload)="file = $event" />
    <bombos-add-form *ngIf="file" [file]="file" (add)="onSubmit($event)" />
    <ul>
      <li *ngFor="let delivery of deliveryService.deliveries$ | async">
        <bombos-delivery-card
          class="block mb-1"
          [delivery]="delivery"
          (complete)="onComplete(delivery.id)"
        />
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InDeliveryService],
  imports: [
    NgForOf,
    AsyncPipe,
    NgIf,
    NgOptimizedImage,
    ReactiveFormsModule,
    NavigationTabsComponent,
    DeliveryCardComponent,
    AddFormComponent,
    UploadFileComponent,
  ],
})
export class DeliveriesViewComponent {
  readonly deliveryService: DeliveryService = inject(InDeliveryService);
  file: File | null = null;

  onSubmit(delivery: Delivery) {
    this.deliveryService.add(delivery);
  }

  onComplete(id: string) {
    this.deliveryService.complete(id);
  }
}

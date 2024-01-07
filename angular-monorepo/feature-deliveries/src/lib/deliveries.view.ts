import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Delivery,
  DeliveryService,
  InDeliveryService,
} from '@bombos/data-access';
import { ErrorService } from '../../../ui/src/lib/error.service';
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
          [loading]="loadingDeliveryId() === delivery.id"
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
  private readonly errorService = inject(ErrorService);
  readonly deliveryService: DeliveryService = inject(InDeliveryService);
  file: File | null = null;
  loadingDeliveryId = signal('');

  onSubmit(delivery: Delivery) {
    this.file = null;
    this.deliveryService
      .add(delivery)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
  }

  onComplete(id: string) {
    this.loadingDeliveryId.set(id);
    this.deliveryService
      .complete(id)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      )
      .finally(() => this.loadingDeliveryId.set(''));
  }
}

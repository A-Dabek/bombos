import { ErrorService, LoadingComponent } from '@angular-monorepo/ui';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { ReactiveFormsModule } from '@angular/forms';
import { Delivery, DeliveryService } from '@bombos/data-access';
import { AddFormComponent } from './add-form.component';
import { DeliveryCardComponent } from './delivery-card.component';
import { NavigationTabsComponent, TabName } from './navigation-tabs.component';
import { UploadFileComponent } from './upload-file.component';

@Component({
  standalone: true,
  selector: 'bombos-deliveries-view',
  template: `
    <bombos-navigation-tabs
      class="block mb-2"
      [selected]="activeTab"
      (select)="onTabChange($event)"
    />
    <div class="relative h-screen">
      <bombos-add-form *ngIf="file" [file]="file" (add)="onSubmit($event)" />
      <ul>
        <li *ngFor="let delivery of deliveryStore.deliveries$ | async">
          <bombos-delivery-card
            class="block mb-1"
            [loading]="loadingDeliveryId() === delivery.id"
            [delivery]="delivery"
            (complete)="onComplete(delivery.id)"
          />
        </li>
      </ul>
      <bombos-loading *ngIf="loadingTabs()" />
    </div>
    <bombos-upload-file
      class="fixed bottom-3 right-3"
      (upload)="file = $event"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    LoadingComponent,
  ],
})
export class DeliveriesViewComponent {
  private readonly errorService = inject(ErrorService);
  private readonly deliveryService = inject(DeliveryService);

  activeTab: TabName = 'collect';
  deliveryStore = this.deliveryService.getDeliveriesStore('in');

  file: File | null = null;
  loadingTabs = signal(false);
  loadingDeliveryId = signal('');

  onTabChange(tab: TabName) {
    this.activeTab = tab;
    this.deliveryStore =
      tab === 'collect'
        ? this.deliveryService.getDeliveriesStore('in')
        : this.deliveryService.getDeliveriesStore('out');
  }

  onSubmit(delivery: Delivery) {
    this.file = null;
    this.deliveryStore
      .add(delivery)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
  }

  onComplete(id: string) {
    this.loadingDeliveryId.set(id);
    this.deliveryStore
      .complete(id)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      )
      .finally(() => this.loadingDeliveryId.set(''));
  }
}

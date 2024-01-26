import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { ReactiveFormsModule } from '@angular/forms';
import { Delivery, DeliveryService, Id } from '@bombos/data-access';
import { ErrorService, LoadingComponent } from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { DeliveryCardComponent } from '../ui/delivery-card.component';
import { AddFormComponent } from './add-form.component';
import { NavigationTabsComponent, TabName } from './navigation-tabs.component';
import { UploadFileComponent } from './upload-file.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-deliveries-view',
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
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <bombos-navigation-tabs
      class="block mb-2"
      [selected]="activeTab"
      (select)="onTabChange($event)"
    />
    <div class="relative h-screen">
      <bombos-add-form
        class="block"
        *ngIf="file"
        [@enterItem]
        [@leaveItem]
        [file]="file"
        (add)="onSubmit($event)"
      />
      <ul>
        <li
          [@enterItem]
          [@leaveItem]
          *ngFor="
            let delivery of deliveryStore.deliveries$ | async;
            trackBy: deliveryTrackBy
          "
        >
          <bombos-delivery-card
            class="block mb-2"
            [loading]="loadingDeliveryId() === delivery.id"
            [delivery]="delivery"
            [link]="[
              'delivery',
              activeTab === 'collect' ? 'in' : 'out',
              delivery.id
            ]"
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
})
export class DeliveriesViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';

  private readonly errorService = inject(ErrorService);
  private readonly deliveryService = inject(DeliveryService);

  activeTab: TabName = 'collect';
  deliveryStore = this.deliveryService.getDeliveriesStore('in');
  deliveryTrackBy = (index: number, delivery: Delivery & Id) => delivery.id;

  file: File | null = null;
  loadingTabs = signal(false);
  loadingDeliveryId = signal('');
  pickedDeliveryId = signal('');

  onTabChange(tab: TabName) {
    this.file = null;
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
      .finally(() => {
        this.loadingDeliveryId.set('');
        this.pickedDeliveryId.set('');
      });
  }
}

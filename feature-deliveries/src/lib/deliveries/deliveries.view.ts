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
import {
  ErrorService,
  LoadingComponent,
  NavigationTabsComponent,
  TabItem,
} from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { DeliveryCardComponent } from '../ui/delivery-card.component';
import { AddFormComponent } from './add-form.component';
import { UploadFileComponent } from './upload-file.component';

type TabName = 'collect' | 'send';

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
      [tabs]="tabs"
      [selected]="activeTab"
      (select)="onTabChange($event)"
    />
    <div class="relative h-screen">
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
            (update)="onAliasUpdate(delivery.id, $event)"
            (complete)="onComplete(delivery.id)"
          />
        </li>
      </ul>
      <bombos-loading *ngIf="loadingTabs()" />
    </div>
    <bombos-upload-file
      class="fixed bottom-3 right-3"
      (upload)="onFileAdd($event)"
    />
  `,
})
export class DeliveriesViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';

  private readonly errorService = inject(ErrorService);
  private readonly deliveryService = inject(DeliveryService);

  readonly tabs = [
    { name: 'collect', icon: 'collect', display: 'odbierz' },
    { name: 'send', icon: 'send', display: 'nadaj' },
  ] as TabItem[];
  activeTab: TabName = 'collect';
  deliveryStore = this.deliveryService.getDeliveriesStore('in');
  deliveryTrackBy = (_: number, delivery: Delivery & Id) => delivery.id;

  file: File | null = null;
  loadingTabs = signal(false);
  loadingDeliveryId = signal('');
  pickedDeliveryId = signal('');

  onTabChange(tab: string) {
    this.file = null;
    this.activeTab = tab as TabName;
    this.deliveryStore =
      tab === 'collect'
        ? this.deliveryService.getDeliveriesStore('in')
        : this.deliveryService.getDeliveriesStore('out');
  }

  onFileAdd(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fileBase64 = reader.result as string;
      this.deliveryStore
        .add({ alias: '', img: fileBase64 })
        .catch((error: FirebaseError) =>
          this.errorService.raiseError(error.toString())
        );
    };
  }

  onAliasUpdate(id: string, alias: string) {
    this.deliveryStore
      .updateAlias(id, alias)
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

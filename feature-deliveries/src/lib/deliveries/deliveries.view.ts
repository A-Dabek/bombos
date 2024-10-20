import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FirebaseError } from '@angular/fire/app/firebase';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Delivery, DeliveryService, Id, TabName } from '@bombos/data-access';
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
import { map, tap } from 'rxjs';
import { DeliveryCardComponent } from '../ui/delivery-card.component';
import { AddFormComponent } from './add-form.component';
import { UploadFileComponent } from './upload-file.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-deliveries-view',
  imports: [
    AsyncPipe,
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
      [selected]="activeTab()"
      (select)="onTabChange($event)"
    />
    <div class="relative h-screen">
      <ul>
        @for (delivery of deliveryStore.deliveries$ | async; track
        deliveryTrackBy($index, delivery)) {
        <li [@enterItem] [@leaveItem]>
          <bombos-delivery-card
            class="block mb-2"
            [loading]="loadingDeliveryId() === delivery.id"
            [delivery]="delivery"
            [link]="['/', 'deliveries', 'delivery', activeTab(), delivery.id]"
            (update)="onAliasUpdate(delivery.id, $event)"
            (complete)="onComplete(delivery.id)"
          />
        </li>
        }
      </ul>
      @if (loadingTabs()) {
      <bombos-loading />
      }
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly tabs = [
    { name: 'collect', icon: 'collect', display: 'odbierz' },
    { name: 'send', icon: 'send', display: 'nadaj' },
  ] as TabItem[];
  readonly activeTab = signal<TabName>('collect');
  readonly deliveryTrackBy = (_: number, delivery: Delivery & Id) =>
    delivery.id;
  readonly loadingTabs = signal(false);
  readonly loadingDeliveryId = signal('');
  readonly pickedDeliveryId = signal('');
  deliveryStore = this.deliveryService.getDeliveriesStore('collect');

  private sub = this.route.paramMap
    .pipe(
      takeUntilDestroyed(),
      map((paramsMap) => paramsMap.get('tab') as TabName),
      tap((tabFromRoute) => {
        this.activeTab.set(tabFromRoute);
        this.deliveryStore =
          this.deliveryService.getDeliveriesStore(tabFromRoute);
      })
    )
    .subscribe();

  onTabChange(tab: string) {
    this.router.navigate(['/', 'deliveries', tab]);
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

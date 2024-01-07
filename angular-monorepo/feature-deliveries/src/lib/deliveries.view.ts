import { LoadingComponent } from '@angular-monorepo/ui';
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
import { tap } from 'rxjs';
import { OutDeliveryService } from '../../../data-access/src/lib/deliveries/out-delivery.service';
import { ErrorService } from '../../../ui/src/lib/error.service';
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
        <li *ngFor="let delivery of deliveries$ | async">
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
  providers: [InDeliveryService, OutDeliveryService],
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
  private readonly inDeliveryService = inject(InDeliveryService);
  private readonly outDeliveryService = inject(OutDeliveryService);
  private deliveryService: DeliveryService = this.inDeliveryService;
  deliveries$ = this.deliveryService.deliveries$;

  activeTab: TabName = 'collect';

  file: File | null = null;
  loadingTabs = signal(false);
  loadingDeliveryId = signal('');

  onTabChange(tab: TabName) {
    this.loadingTabs.set(true);
    this.activeTab = tab;
    this.deliveryService =
      tab === 'collect' ? this.inDeliveryService : this.outDeliveryService;
    this.deliveries$ = this.deliveryService.deliveries$.pipe(
      tap(() => this.loadingTabs.set(false))
    );
  }

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

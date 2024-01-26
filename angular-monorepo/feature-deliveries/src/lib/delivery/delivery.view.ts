import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Delivery,
  DeliveryService,
  DeliveryStore,
  Id,
} from '@bombos/data-access';
import { ErrorService, LoadingComponent } from '@bombos/ui';
import { bounceInRightOnEnterAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { AddFormComponent } from '../deliveries/add-form.component';
import { NavigationTabsComponent } from '../deliveries/navigation-tabs.component';
import { UploadFileComponent } from '../deliveries/upload-file.component';
import { DeliveryCardComponent } from '../ui/delivery-card.component';

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
  ],
  template: `
    <div class="relative h-screen">
      <bombos-delivery-card
        *ngIf="delivery$ | async as delivery"
        class="block mb-2"
        [loading]="loading()"
        [fullHeight]="true"
        [delivery]="delivery"
        (complete)="onComplete(delivery.id)"
      />
    </div>
  `,
})
export class DeliveryViewComponent implements OnInit {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';

  @Input() id = '';
  @Input() type: 'in' | 'out' = 'in';

  delivery$!: Observable<Delivery & Id>;

  private readonly errorService = inject(ErrorService);
  private readonly deliveryService = inject(DeliveryService);
  private readonly router = inject(Router);

  private deliveryStore!: DeliveryStore;

  loading = signal(false);

  ngOnInit() {
    this.deliveryStore = this.deliveryService.getDeliveriesStore(this.type);
    this.delivery$ = this.deliveryStore.getDelivery(this.id);
  }

  onComplete(id: string) {
    this.loading.set(true);
    this.deliveryStore
      .complete(id)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      )
      .finally(() => {
        this.loading.set(false);
        this.router.navigate(['/deliveries']);
      });
  }
}

import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DeliveryService } from '../../../data-access/src/lib/packages/delivery.service';
import { InDeliveryService } from '../../../data-access/src/lib/packages/in-delivery.service';

@Component({
  standalone: true,
  selector: 'bombos-deliveries-view',
  template: `
    <nav>
      <ul>
        <li>In</li>
        <li>Out</li>
      </ul>
    </nav>
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <input type="file" accept="image/*" (change)="onFileUpload($event)" />
      <div *ngIf="currentFileBase64">
        <img [src]="currentFileBase64" />
        <label>Alias</label>
        <input formControlName="alias" type="text" />
        <button type="submit">Add</button>
      </div>
    </form>
    <ul>
      <li *ngFor="let delivery of deliveryService.deliveries$ | async">
        <label>{{ delivery.alias }}</label>
        <img [src]="delivery.img" />
        <button (click)="onComplete(delivery.id)">Complete</button>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InDeliveryService],
  imports: [NgForOf, AsyncPipe, NgIf, NgOptimizedImage, ReactiveFormsModule],
})
export class DeliveriesViewComponent implements OnInit {
  readonly deliveryService: DeliveryService = inject(InDeliveryService);
  private readonly cdr = inject(ChangeDetectorRef);
  currentFileBase64: string | null = null;

  private fb = inject(FormBuilder);
  formGroup = this.fb.group({
    alias: this.fb.control('', { nonNullable: true }),
    file: this.fb.control<File | null>(null),
  });

  ngOnInit() {
    this.formGroup.controls.file.valueChanges.subscribe((file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.currentFileBase64 = reader.result as string;
        this.cdr.markForCheck();
      };
    });
  }

  onFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (!file) return;
    this.formGroup.controls.file.setValue(file);
  }

  onSubmit() {
    console.log('submitted');
    this.deliveryService.add({
      alias: this.formGroup.controls.alias.value,
      img: this.currentFileBase64!,
    });
    this.formGroup.reset();
  }

  onComplete(id: string) {
    console.log(id);
    this.deliveryService.complete(id);
  }
}

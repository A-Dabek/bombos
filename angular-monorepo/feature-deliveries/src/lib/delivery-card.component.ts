import {
  ConfirmButtonComponent,
  IconComponent,
  LoadingComponent,
} from '@angular-monorepo/ui';
import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Delivery } from '@bombos/data-access';

@Component({
  standalone: true,
  selector: 'bombos-delivery-card',
  template: `
    <div
      class="relative flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100   "
    >
      <img
        class="object-cover border border-1 w-full rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        [ngClass]="fullScreenImage ? 'h-full' : 'h-24'"
        [src]="delivery.img"
        alt=""
        (click)="fullScreenImage = !fullScreenImage"
      />
      <div class="flex w-full justify-between p-2 leading-normal">
        <label class="mb-2 tracking-tight text-gray-900 ">
          {{ delivery.alias }}
        </label>
        <div>
          <bombos-confirm-button (confirm)="complete.emit()">
            <button
              type="button"
              class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm p-2 me-2 mb-2"
            >
              <bombos-icon name="delivery" />
            </button>
          </bombos-confirm-button>
        </div>
      </div>
      <bombos-loading *ngIf="loading" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconComponent,
    LoadingComponent,
    NgIf,
    NgClass,
    ConfirmButtonComponent,
  ],
})
export class DeliveryCardComponent {
  @Input({ required: true }) delivery!: Delivery;
  @Input() loading = false;

  @Output() complete = new EventEmitter();

  fullScreenImage = false;
}

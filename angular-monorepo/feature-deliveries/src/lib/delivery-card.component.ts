import { NgClass, NgIf, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Delivery, Id } from '@bombos/data-access';
import {
  ConfirmButtonComponent,
  IconComponent,
  LoadingComponent,
} from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-delivery-card',
  template: `
    <bombos-loading *ngIf="loading" />
    <img
      #img
      class="inner object-cover border border-1 w-full rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
      [src]="delivery.img"
      [ngClass]="fullHeight ? 'h-full' : 'h-24'"
      alt=""
      [routerLink]="link"
    />
    <div class="flex w-full justify-between p-2 leading-normal">
      <label class="mb-2 tracking-tight text-gray-900 ">
        {{ delivery.alias }}
      </label>
      <div [ngClass]="fullHeight ? 'fixed bottom-3 right-3' : ''">
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconComponent,
    LoadingComponent,
    NgIf,
    NgClass,
    ConfirmButtonComponent,
    NgStyle,
    RouterLink,
  ],
})
export class DeliveryCardComponent {
  @HostBinding('class') _ =
    'block relative flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100';

  @ViewChild('img', { read: ElementRef }) img!: ElementRef<HTMLImageElement>;

  @Input({ required: true }) delivery!: Delivery & Id;
  @Input() loading = false;
  @Input() link: unknown[] = [];
  @HostBinding('class.flex-col-reverse') @Input() fullHeight = false;

  @Output() complete = new EventEmitter();
}

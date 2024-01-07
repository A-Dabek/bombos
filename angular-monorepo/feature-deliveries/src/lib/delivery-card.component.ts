import { IconComponent, LoadingComponent } from '@angular-monorepo/ui';
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
      class=" relative flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <img
        class="object-cover w-full rounded-t-lg h-24 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        [src]="delivery.img"
        alt=""
      />
      <div class="flex w-full justify-between p-2 leading-normal">
        <label class="mb-2 tracking-tight text-gray-900 dark:text-white">
          {{ delivery.alias }}
        </label>
        <div>
          <button
            type="button"
            class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm p-0.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            (click)="complete.emit()"
          >
            <bombos-icon name="check" />
          </button>
        </div>
      </div>
      <bombos-loading />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, LoadingComponent],
})
export class DeliveryCardComponent {
  @Input({ required: true }) delivery!: Delivery;

  @Output() complete = new EventEmitter();
}

import { ConfirmButtonComponent, IconComponent } from '@angular-monorepo/ui';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dish } from '@bombos/data-access';
import { Id } from '../../../data-access/src/lib/model';

@Component({
  standalone: true,
  selector: 'bombos-dish-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow  "
    >
      <div class="flex justify-between">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
          {{ dish.name }}
        </h5>
        <bombos-confirm-button (confirm)="delete.emit()">
          <button
            class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2 me-2 mb-2"
          >
            <bombos-icon name="delete" />
          </button>
        </bombos-confirm-button>
      </div>
    </div>
  `,
  imports: [RouterLink, IconComponent, ConfirmButtonComponent],
})
export class DishCardComponent {
  @Input({ required: true }) dish!: Dish & Id;

  @Output() delete = new EventEmitter();
}

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dish } from '@bombos/data-access';

@Component({
  standalone: true,
  selector: 'bombos-dish-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
      {{ dish().name }}
    </h5>
  `,
  imports: [RouterLink],
})
export class DishCardComponent {
  @HostBinding('class') readonly clazz =
    'block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100';

  dish = input.required<Dish>();
}

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Id, ShoppingList } from '@bombos/data-access';

@Component({
  standalone: true,
  selector: 'bombos-list-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
      {{ list.name }}
    </h5>
  `,
  imports: [RouterLink],
})
export class MealCardComponent {
  @HostBinding('class') readonly clazz =
    'block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100';

  @Input({ required: true }) list!: ShoppingList & Id;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ShoppingItem } from '@bombos/data-access';

@Component({
  standalone: true,
  selector: 'bombos-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="block">
      {{ item.name }}
      <span class="text-sm"> ({{ item.amount }}{{ item.unit }}) </span>
    </span>
    <span class="block text-xs">{{ item.description }}</span>
  `,
})
export class ListItemComponent {
  @Input({ required: true }) item!: ShoppingItem;
}

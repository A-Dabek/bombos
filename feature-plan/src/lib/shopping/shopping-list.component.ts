import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Id, ShoppingItem } from '@bombos/data-access';
import { shakeAnimation } from 'angular-animations';
import { ListItemComponent } from '../planning/list-item.component';

@Component({
  selector: 'bombos-shopping-list',
  standalone: true,
  imports: [ListItemComponent],
  animations: [
    shakeAnimation({
      anchor: 'enterItem',
      duration: 500,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shopping-group mb-2">
      <div class="absolute -top-3 left-3 font-bold text-xs">
        {{ selectedGroup() || 'Brak' }}
      </div>
      <ol class="px-2">
        @for (item of currentItems(); track item.id) {
        <li [@enterItem]="!item.bought">
          <bombos-list-item
            class="block"
            [item]="item"
            [highlight]="recentlyInteracted.indexOf(item.id) + 1"
            (click)="onItemClick(item)"
          />
        </li>
        }
      </ol>
    </div>
    <hr />
    <div>Ostatnie</div>
    <ol class="ml-2">
      @for(recentItemName of namesOfRecentlyInteracted; track $index) {
      <li class="text-sm">{{ recentItemName || '&zwnj;' }}</li>
      }
    </ol>
  `,
})
export class ShoppingListComponent {
  readonly selectedGroup = input<string>('');
  readonly items = input<(ShoppingItem & Id)[]>([]);

  private readonly sortedItems = computed(() =>
    [...this.items()].sort((prev, curr) => {
      if (!!prev.bought === !!curr.bought) {
        return prev.name.localeCompare(curr.name);
      }
      return prev.bought ? 1 : -1;
    })
  );

  protected currentItems = computed(() => {
    if (!this.selectedGroup()) {
      return this.sortedItems();
    }
    return this.sortedItems().filter(
      (item) =>
        this.selectedGroup() === 'Wszystkie' ||
        item.group === this.selectedGroup()
    );
  });

  recentlyInteracted = [] as string[];
  namesOfRecentlyInteracted = new Array(3).fill('') as string[];

  readonly itemClick = output<ShoppingItem & Id>();

  onItemClick(item: ShoppingItem & Id) {
    const index = this.recentlyInteracted.indexOf(item.id);
    if (index !== -1) {
      this.recentlyInteracted = this.recentlyInteracted.filter(
        (id) => id !== item.id
      );
    }
    this.recentlyInteracted = [item.id, ...this.recentlyInteracted].slice(0, 3);
    this.namesOfRecentlyInteracted = this.recentlyInteracted.map(
      (id) => this.sortedItems().find((item) => item.id === id)?.name ?? ''
    );
    this.itemClick.emit(item);
  }
}

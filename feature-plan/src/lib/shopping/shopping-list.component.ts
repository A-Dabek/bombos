import { JsonPipe, KeyValuePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  output,
  signal,
} from '@angular/core';
import { Id, ShoppingItem } from '@bombos/data-access';
import { IconComponent } from '@bombos/ui';
import { shakeAnimation } from 'angular-animations';
import { ListItemComponent } from '../planning/list-item.component';
import { ListItemsComponent } from '../planning/list-items.component';
import { ShoppingGroupButton } from './shopping-group-button.component';

@Component({
  standalone: true,
  selector: 'bombos-shopping-list',
  animations: [
    shakeAnimation({
      anchor: 'enterItem',
      duration: 500,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-1 mb-3">
      @for (keyValue of groupedNormalItems | keyvalue; track keyValue.key) {
      <bombos-shopping-group-button
        [active]="selectedGroup() === keyValue.key"
        [count]="numberOfItemsLeft(keyValue.key)"
        [urgentCount]="numberOfUrgentItems(keyValue.key)"
        [groupKey]="keyValue.key"
        (itemClick)="onSelectGroup(keyValue.key)"
      />
      } @for (keyValue of groupedBoughtItems | keyvalue; track keyValue.key) {
      <bombos-shopping-group-button
        [active]="selectedGroup() === keyValue.key"
        [count]="numberOfItemsLeft(keyValue.key)"
        [urgentCount]="numberOfUrgentItems(keyValue.key)"
        [groupKey]="keyValue.key"
        (itemClick)="onSelectGroup(keyValue.key)"
      />
      }
    </div>
    <div class="shopping-group mb-2">
      <div class="absolute -top-3 left-3 font-bold text-xs">
        {{ selectedGroup() || 'Brak' }}
      </div>
      <ol class="px-2">
        @for ( item of groupedItems[selectedGroup()]; track item.id) {
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
  imports: [
    KeyValuePipe,
    ListItemsComponent,
    IconComponent,
    ListItemComponent,
    NgClass,
    JsonPipe,
    ShoppingGroupButton,
  ],
})
export class ShoppingListComponent {
  @Input() set items(value: (ShoppingItem & Id)[]) {
    this.allItems = [...value].sort((prev, curr) => {
      if (!!prev.bought === !!curr.bought) {
        return prev.name.localeCompare(curr.name);
      }
      return prev.bought ? 1 : -1;
    });

    const groups = this.allItems.reduce((acc, item) => {
      const key = item.group;
      return { ...acc, [key]: [...(acc[key] || []), item] };
    }, {} as Record<string, (ShoppingItem & Id)[]>);
    const entries = Object.entries(groups);
    this.groupedItems = Object.fromEntries(entries);
    this.groupedItems['Wszystkie'] = this.allItems;

    const itemEntries = Object.entries(this.groupedItems);

    this.groupedNormalItems = Object.fromEntries(
      itemEntries.filter((entry) => entry[1].some((item) => !item.bought))
    );
    this.groupedBoughtItems = Object.fromEntries(
      itemEntries.filter((entry) => entry[1].every((item) => item.bought))
    );
  }

  selectedGroup = signal('');
  allItems: (ShoppingItem & Id)[] = [];
  groupedItems: Record<string, (ShoppingItem & Id)[]> = {};
  groupedBoughtItems: Record<string, (ShoppingItem & Id)[]> = {};
  groupedNormalItems: Record<string, (ShoppingItem & Id)[]> = {};
  recentlyInteracted = [] as string[];
  namesOfRecentlyInteracted = new Array(3).fill('') as string[];

  itemClick = output<ShoppingItem & Id>();

  numberOfUrgentItems(group: string) {
    return this.groupedItems[group].filter(
      (item) => item.urgent && !item.bought
    ).length;
  }

  numberOfItemsLeft(group: string) {
    return this.groupedItems[group].filter((item) => !item.bought).length;
  }

  onItemClick(item: ShoppingItem & Id) {
    this.itemClick.emit(item);
    this.recentlyInteracted = [item.id, ...this.recentlyInteracted].slice(0, 3);
    this.namesOfRecentlyInteracted = this.namesOfRecentlyInteracted
      .map((_, index) => this.recentlyInteracted[index] || '')
      .map((id) =>
        id ? this.allItems.find((item) => item.id === id)?.name || '' : ''
      );
  }

  onSelectGroup(group: string) {
    this.selectedGroup.set(group);
  }
}

import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Id, ShoppingItem } from '@bombos/data-access';
import { ShoppingGroupButtonComponent } from './shopping-group-button.component';

@Component({
  selector: 'bombos-shopping-groups',
  standalone: true,
  imports: [KeyValuePipe, ShoppingGroupButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-1 mb-3">
      @for (keyValue of groupedNormalItems | keyvalue; track keyValue.key) {
      <bombos-shopping-group-button
        [active]="selectedGroup === keyValue.key"
        [finished]="isFinished(keyValue.key)"
        [count]="numberOfItemsLeft(keyValue.key)"
        [urgentCount]="numberOfUrgentItems(keyValue.key)"
        [groupKey]="keyValue.key"
        (itemClick)="onSelectGroup(keyValue.key)"
      />
      } @for (keyValue of groupedBoughtItems | keyvalue; track keyValue.key) {
      <bombos-shopping-group-button
        [active]="selectedGroup === keyValue.key"
        [finished]="isFinished(keyValue.key)"
        [count]="numberOfItemsLeft(keyValue.key)"
        [urgentCount]="numberOfUrgentItems(keyValue.key)"
        [groupKey]="keyValue.key"
        (itemClick)="onSelectGroup(keyValue.key)"
      />
      }
    </div>
  `,
})
export class ShoppingGroupsComponent {
  @Input() selectedGroup = '';
  @Input({ required: true }) isFinished!: (group: string) => boolean;
  @Output() selectedGroupChange = new EventEmitter<string>();

  private groupedItems: Record<string, (ShoppingItem & Id)[]> = {};
  protected groupedBoughtItems: Record<string, (ShoppingItem & Id)[]> = {};
  protected groupedNormalItems: Record<string, (ShoppingItem & Id)[]> = {};

  @Input() set items(value: (ShoppingItem & Id)[]) {
    const sortedItems = [...value].sort((prev, curr) => {
      if (!!prev.bought === !!curr.bought) {
        return prev.name.localeCompare(curr.name);
      }
      return prev.bought ? 1 : -1;
    });

    const groups = sortedItems.reduce((acc, item) => {
      const key = item.group;
      return { ...acc, [key]: [...(acc[key] || []), item] };
    }, {} as Record<string, (ShoppingItem & Id)[]>);

    this.groupedItems = {
      ...Object.fromEntries(Object.entries(groups)),
      Wszystkie: sortedItems,
    };

    const itemEntries = Object.entries(this.groupedItems);

    this.groupedNormalItems = Object.fromEntries(
      itemEntries.filter((entry) => entry[1].some((item) => !item.bought))
    );
    this.groupedBoughtItems = Object.fromEntries(
      itemEntries.filter((entry) => entry[1].every((item) => item.bought))
    );
  }

  onSelectGroup(group: string) {
    this.selectedGroupChange.emit(group);
  }

  protected numberOfUrgentItems(group: string) {
    return (
      this.groupedItems[group]?.filter((item) => item.urgent && !item.bought)
        .length ?? 0
    );
  }

  protected numberOfItemsLeft(group: string) {
    return this.groupedItems[group]?.filter((item) => !item.bought).length ?? 0;
  }
}

import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
      @for (keyValue of activeGroups | keyvalue; track keyValue.key) {
      <bombos-shopping-group-button
        [active]="selectedGroup === keyValue.key"
        [count]="numberOfItemsLeft(keyValue.key)"
        [urgentCount]="numberOfUrgentItems(keyValue.key)"
        [groupKey]="keyValue.key"
        (itemClick)="onSelectGroup(keyValue.key)"
      />
      } @for (keyValue of finishedGroupsIndex | keyvalue; track keyValue.key) {
      <bombos-shopping-group-button
        [active]="selectedGroup === keyValue.key"
        [finished]="onlyFinishedGroupsIndex[keyValue.key]"
        [groupKey]="keyValue.key"
        (itemClick)="onSelectGroup(keyValue.key)"
      />
      }
    </div>
  `,
})
export class ShoppingGroupsComponent implements OnChanges {
  @Input() selectedGroup = '';
  @Input({ required: true }) finishedGroups: string[] = [];
  @Input() items: (ShoppingItem & Id)[] = [];

  @Output() selectedGroupChange = new EventEmitter<string>();

  private groupedItems: Record<string, (ShoppingItem & Id)[]> = {};
  protected activeGroups: Record<string, (ShoppingItem & Id)[]> = {};
  protected finishedGroupsIndex: Record<string, (ShoppingItem & Id)[]> = {};
  protected onlyFinishedGroupsIndex: Record<string, boolean> = {};

  ngOnChanges() {
    const sortedItems = [...this.items].sort((prev, curr) => {
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

    // Split groups based on finished state
    this.activeGroups = Object.fromEntries(
      itemEntries.filter((entry) => !this.finishedGroups.includes(entry[0]))
    );

    this.finishedGroupsIndex = Object.fromEntries(
      itemEntries.filter((entry) => this.finishedGroups.includes(entry[0]))
    );

    this.onlyFinishedGroupsIndex = Object.fromEntries(
      this.finishedGroups.map((group) => [group, true])
    );

    // Move bought groups to finished
    const boughtGroups = itemEntries.filter(
      ([key, items]) =>
        key !== 'Wszystkie' && items.every((item) => item.bought)
    );

    boughtGroups.forEach(([key, items]) => {
      delete this.activeGroups[key];
      this.finishedGroupsIndex[key] = items;
    });
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

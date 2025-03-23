import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { Id, ShoppingItem, ShoppingService } from '@bombos/data-access';
import { ErrorService } from '@bombos/ui';
import { bounceInRightOnEnterAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { ShoppingButtonsComponent } from './shopping-buttons.component';
import { ShoppingListComponent } from './shopping-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-shopping-view',
  imports: [ShoppingListComponent, AsyncPipe, ShoppingButtonsComponent],
  providers: [ShoppingService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: `
    <div
      class="block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
    >
      @let items = (items$ | async) || [];
      <bombos-shopping-list
        class="block mb-1"
        [items]="items"
        [isFinished]="isGroupFinished"
        [selectedGroup]="currentGroup()"
        (itemClick)="onItemBuy($event)"
        (selectedGroupChange)="onSelectedGroupChange($event)"
      />
      <bombos-shopping-buttons
        [currentGroup]="currentGroup()"
        [isGroupFinished]="isGroupFinished(currentGroup())"
        [items]="items"
        (toggleFinished)="onToggleGroupFinished($event)"
        (clearItems)="onClearItems($event)"
      />
    </div>
  `,
})
export class ShoppingViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block h-screen';

  items$!: Observable<(ShoppingItem & Id)[]>;
  private listId = '';

  @Input() set id(value: string) {
    this.listId = value;
    this.items$ = this.shoppingService.listItems$(value);
  }

  private readonly errorService = inject(ErrorService);
  private readonly shoppingService = inject(ShoppingService);
  private readonly finishedGroups = signal<string[]>([]);
  readonly currentGroup = signal<string>('');

  onItemBuy(item: ShoppingItem & Id) {
    this.onItemEdit({ ...item, bought: !item.bought });
  }

  onSelectedGroupChange(group: string) {
    this.currentGroup.set(group);
  }

  readonly isGroupFinished = (group: string): boolean => {
    return this.finishedGroups().includes(group);
  };

  private onItemEdit(item: ShoppingItem & Id) {
    this.shoppingService
      .updateItem(this.listId, item.id, item)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
  }

  onToggleGroupFinished(group: string) {
    const finished = this.finishedGroups();
    if (finished.includes(group)) {
      this.finishedGroups.set(finished.filter((g) => g !== group));
    } else {
      this.finishedGroups.set([...finished, group]);
    }
  }

  onClearItems(items: (ShoppingItem & Id)[]) {
    const boughtItems = items.filter((item) => item.bought);
    boughtItems.forEach((item) =>
      this.shoppingService
        .deleteItem(this.listId, item.id)
        .catch((error: FirebaseError) =>
          this.errorService.raiseError(error.toString())
        )
    );
  }
}

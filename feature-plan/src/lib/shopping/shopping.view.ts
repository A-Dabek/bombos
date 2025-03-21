import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { Id, ShoppingItem, ShoppingService } from '@bombos/data-access';
import {
  ConfirmButtonComponent,
  ErrorService,
  IconComponent,
} from '@bombos/ui';
import { bounceInRightOnEnterAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { ShoppingListComponent } from './shopping-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-shopping-view',
  imports: [
    ShoppingListComponent,
    AsyncPipe,
    ConfirmButtonComponent,
    IconComponent,
    NgClass,
  ],
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
        (itemClick)="onItemBuy($event)"
      />
      <div class="flex justify-end mb-2">
        <bombos-confirm-button (confirm)="onClearItems(items)">
          <button
            class="w-full flex-grow focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm p-2"
            [ngClass]="{
              'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-800': true
            }"
          >
            <bombos-icon name="planning-check" />
          </button>
        </bombos-confirm-button>
      </div>
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

  onItemBuy(item: ShoppingItem & Id) {
    this.onItemEdit({ ...item, bought: !item.bought });
  }

  private onItemEdit(item: ShoppingItem & Id) {
    this.shoppingService
      .updateItem(this.listId, item.id, item)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
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

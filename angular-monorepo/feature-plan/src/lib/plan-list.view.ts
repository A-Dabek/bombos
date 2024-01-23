import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import {
  Id,
  ShoppingItem,
  ShoppingList,
  ShoppingService,
} from '@bombos/data-access';
import { ErrorService, IconComponent } from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { Observable, tap } from 'rxjs';
import { OrderManager } from '../../../feature-food/src/lib/order-manager';
import { ListCardComponent } from './list-card.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-plan-list-view',
  imports: [NgForOf, AsyncPipe, NgIf, ListCardComponent, IconComponent],
  providers: [ShoppingService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <div class="relative h-screen">
      <ul *ngIf="orderedLists$ | async as lists">
        <li
          *ngFor="let list of lists; trackBy: listTrackBy"
          [@enterItem]
          [@leaveItem]
        >
          <bombos-list-card
            class="block mb-1"
            [list]="list"
            [open]="list.id === openListId"
            [items]="(itemsCache()[list.id] | async) || []"
            (click)="onOpenList(list.id)"
            (newItem)="onItemSave(list.id, $event)"
            (editItem)="onItemEdit(list.id, $event)"
            (deleteItem)="onItemDelete(list.id, $event)"
          >
          </bombos-list-card>
        </li>
      </ul>
    </div>
  `,
})
export class PlanListViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';

  private readonly errorService = inject(ErrorService);
  private readonly shoppingService = inject(ShoppingService);
  private readonly orderManager = new OrderManager('overcooked_meals_order');

  orderedLists$ = this.orderManager.order$(this.shoppingService.lists$).pipe(
    tap((lists) => {
      lists.forEach((list) => {
        if (!this.itemsCache()[list.id]) {
          this.itemsCache.set({
            ...this.itemsCache(),
            [list.id]: this.shoppingService.listItems$(list.id),
          });
        }
      });
    })
  );
  itemsCache = signal<Record<string, Observable<(ShoppingItem & Id)[]>>>({});

  listTrackBy = (_: number, list: ShoppingList & Id) => list.id;

  openListId = '';

  onOpenList(listId: string) {
    this.openListId = this.openListId === listId ? '' : listId;
  }

  onItemSave(listId: string, item: ShoppingItem) {
    this.shoppingService
      .addItem(listId, item)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
  }

  onItemEdit(listId: string, item: ShoppingItem & Id) {
    this.shoppingService
      .updateItem(listId, item.id, item)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
  }

  onItemDelete(listId: string, itemId: string) {
    this.shoppingService
      .deleteItem(listId, itemId)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
  }
}

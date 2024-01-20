import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Id,
  Meal,
  ShoppingItem,
  ShoppingList,
  ShoppingService,
} from '@bombos/data-access';
import { ErrorService, IconComponent, LoadingComponent } from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { Observable, tap } from 'rxjs';
import { UploadFileComponent } from '../../../feature-deliveries/src/lib/upload-file.component';
import { OrderManager } from '../../../feature-food/src/lib/order-manager';
import { AddFormComponent } from './add-form.component';
import { ListCardComponent } from './list-card.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-plan-list-view',
  imports: [
    NgForOf,
    AsyncPipe,
    NgIf,
    NgOptimizedImage,
    ReactiveFormsModule,
    LoadingComponent,
    CdkDrag,
    CdkDropList,
    ListCardComponent,
    AddFormComponent,
    AddFormComponent,
    IconComponent,
    UploadFileComponent,
    AddFormComponent,
  ],
  providers: [ShoppingService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <div class="relative h-screen">
      <bombos-add-list-form
        *ngIf="isFormVisible"
        [@enterItem]
        [@leaveItem]
        class="block mb-1"
        (add)="onSubmit($event)"
      />
      <ul
        *ngIf="orderedLists$ | async as lists"
        cdkDropList
        [cdkDropListData]="lists"
        (cdkDropListDropped)="drop($event)"
      >
        <li
          cdkDrag
          *ngFor="let list of lists; trackBy: listTrackBy"
          [@enterItem]
          [@leaveItem]
        >
          <bombos-list-card
            class="block mb-1"
            [list]="list"
            [open]="list.id === openListId"
            [items]="(itemsCache()[list.id] | async) || []"
            (click)="openListId = list.id"
            (newItem)="onItemSave(list.id, $event)"
            (editItem)="onItemEdit(list.id, $event)"
            (deleteItem)="onItemDelete(list.id, $event)"
          />
        </li>
      </ul>
    </div>
    <div class="fixed bottom-3 right-3">
      <button
        (click)="onAddClick()"
        class="bg-gray-800 hover:bg-gray-700 text-white p-3 outline-none rounded w-max cursor-pointer mx-auto block font-[sans-serif]"
      >
        <bombos-icon name="plus" />
      </button>
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

  isFormVisible = false;
  openListId = '';

  drop(event: CdkDragDrop<(Meal & Id)[]>) {
    this.isFormVisible = false;
    this.openListId = '';
    this.orderManager.reorder(event.previousIndex, event.currentIndex);
  }

  onAddClick() {
    this.isFormVisible = true;
    this.openListId = '';
  }

  onSubmit(list: ShoppingList) {
    this.isFormVisible = false;
    this.shoppingService
      .addList(list)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
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

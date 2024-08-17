import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { Id, Meal, ShoppingList, ShoppingService } from '@bombos/data-access';
import {
  ErrorService,
  FloatingButtonComponent,
  IconComponent,
  OrderManager,
} from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { AddFormComponent } from '../planning/add-form.component';
import { AdminListCardComponent } from './admin-list-card.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-admin-plan-list-view',
  imports: [
    AsyncPipe,
    CdkDrag,
    CdkDropList,
    IconComponent,
    CdkDragHandle,
    AddFormComponent,
    AdminListCardComponent,
    FloatingButtonComponent,
  ],
  providers: [ShoppingService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <div class="relative h-screen">
      @if (isFormVisible) {
      <bombos-add-list-form
        [@enterItem]
        [@leaveItem]
        class="block mb-1"
        (add)="onSubmit($event)"
      />
      } @if (orderedLists$ | async; as lists) {
      <ul
        cdkDropList
        [cdkDropListData]="lists"
        (cdkDropListDropped)="drop($event)"
      >
        @for (list of lists; track listTrackBy($index, list)) {
        <li [@enterItem] [@leaveItem]>
          <bombos-admin-list-card
            cdkDrag
            class="block mb-1"
            [list]="list"
            [loading]="loadingCardId() === list.id"
            (save)="onListSave(list.id, $event)"
            (delete)="onListDelete(list.id)"
          >
            <bombos-icon name="drag" class="block p-2" cdkDragHandle />
          </bombos-admin-list-card>
        </li>
        }
      </ul>
      }
    </div>
    <div class="fixed bottom-3 right-3">
      <button
        (click)="onAddClick()"
        class="bg-gray-800 hover:bg-gray-700 text-white p-3 outline-none rounded w-max cursor-pointer mx-auto block font-[sans-serif]"
      >
        <bombos-icon name="plus" />
      </button>
    </div>
    <bombos-floating-button [link]="['/plan']" />
  `,
})
export class AdminPlanListViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';

  private readonly errorService = inject(ErrorService);
  private readonly shoppingService = inject(ShoppingService);
  private readonly orderManager = new OrderManager('shopaholic_list_order');

  orderedLists$ = this.orderManager.order$(this.shoppingService.lists$);

  listTrackBy = (_: number, list: ShoppingList & Id) => list.id;

  isFormVisible = false;
  openListId = '';
  loadingCardId = signal('');

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

  onListSave(listId: string, list: ShoppingList) {
    this.loadingCardId.set(listId);
    this.shoppingService
      .updateList(listId, list)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      )
      .finally(() => this.loadingCardId.set(''));
  }

  onListDelete(listId: string) {
    this.loadingCardId.set(listId);
    this.shoppingService
      .deleteList(listId)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      )
      .finally(() => this.loadingCardId.set(''));
  }
}

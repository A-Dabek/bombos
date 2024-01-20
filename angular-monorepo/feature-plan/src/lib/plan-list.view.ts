import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { ReactiveFormsModule } from '@angular/forms';
import { Id, Meal, ShoppingList, ShoppingService } from '@bombos/data-access';
import { ErrorService, IconComponent, LoadingComponent } from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { UploadFileComponent } from '../../../feature-deliveries/src/lib/upload-file.component';
import { OrderManager } from '../../../feature-food/src/lib/order-manager';
import { AddFormComponent } from './add-form.component';
import { MealCardComponent } from './list-card.component';

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
    MealCardComponent,
    AddFormComponent,
    AddFormComponent,
    IconComponent,
    UploadFileComponent,
  ],
  providers: [ShoppingService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <div class="relative h-screen">
      <bombos-add-list-form *ngIf="isFormVisible" (add)="onSubmit($event)" />
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
          <bombos-list-card class="block mb-2" [list]="list" />
        </li>
      </ul>
    </div>
    <div class="fixed bottom-3 right-3">
      <button
        (click)="isFormVisible = true"
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

  orderedLists$ = this.orderManager.order$(this.shoppingService.lists$);

  listTrackBy = (index: number, list: ShoppingList & Id) => list.id;

  isFormVisible = false;

  drop(event: CdkDragDrop<(Meal & Id)[]>) {
    this.orderManager.reorder(event.previousIndex, event.currentIndex);
  }

  onSubmit(list: ShoppingList) {
    this.shoppingService
      .addList(list)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
  }
}

import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  Input,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app/firebase';
import { Id, ShoppingItem, ShoppingService } from '@bombos/data-access';
import { ErrorService } from '@bombos/ui';
import { bounceInRightOnEnterAnimation } from 'angular-animations';
import { Observable } from 'rxjs';
import { ShoppingListComponent } from './shopping-list.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-shopping-view',
  imports: [ShoppingListComponent, AsyncPipe],
  providers: [ShoppingService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: `
    <div
      class="block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
    >
      <bombos-shopping-list
        class="block mb-1"
        [items]="(items$ | async) || []"
        (itemClick)="onItemBuy($event)"
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
}

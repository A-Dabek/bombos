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
import { ShoppingCardComponent } from './shopping-card.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-shopping-view',
  imports: [ShoppingCardComponent, AsyncPipe],
  providers: [ShoppingService],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: `
    <bombos-shopping-card class="block mb-1" [items]="(items$ | async) || []" />
  `,
})
export class ShoppingViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block h-screen';

  items$!: Observable<(ShoppingItem & Id)[]>;

  @Input() set id(value: string) {
    this.items$ = this.shoppingService.listItems$(value);
  }

  private readonly errorService = inject(ErrorService);
  private readonly shoppingService = inject(ShoppingService);

  onItemEdit(listId: string, item: ShoppingItem & Id) {
    this.shoppingService
      .updateItem(listId, item.id, item)
      .catch((error: FirebaseError) =>
        this.errorService.raiseError(error.toString())
      );
  }
}

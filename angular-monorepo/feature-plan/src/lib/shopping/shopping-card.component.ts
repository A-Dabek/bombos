import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { KeyValuePipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Id, ShoppingItem } from '@bombos/data-access';
import { ConfirmButtonComponent, IconComponent } from '@bombos/ui';
import { ListItemsComponent } from '../planning/list-items.component';

@Component({
  standalone: true,
  selector: 'bombos-shopping-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (keyValue of groupedItems | keyvalue; track keyValue.key) {
    <bombos-list-items class="block mb-2" [items]="keyValue.value" />
    }
  `,
  imports: [
    RouterLink,
    NgIf,
    ConfirmButtonComponent,
    IconComponent,
    KeyValuePipe,
    ListItemsComponent,
    CdkDrag,
    CdkDragHandle,
    ListItemsComponent,
  ],
})
export class ShoppingCardComponent {
  @HostBinding('class') readonly clazz =
    'block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100';

  @Input() set items(value: (ShoppingItem & Id)[]) {
    this.groupedItems = value.reduce((acc, item) => {
      const key = item.group;
      return { ...acc, [key]: [...(acc[key] || []), item] };
    }, {} as Record<string, (ShoppingItem & Id)[]>);
  }
  groupedItems: Record<string, (ShoppingItem & Id)[]> = {};
}

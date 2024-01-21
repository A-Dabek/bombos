import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Id, ShoppingItem } from '@bombos/data-access';
import { IconComponent } from '@bombos/ui';
import { ListItemComponent } from './list-item.component';

@Component({
  standalone: true,
  selector: 'bombos-list-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <style>
      div.relative:before {
        content: '';
        pointer-events: none;
        position: absolute;
        inset: -2px;
        border: 2px solid #0000;
        border-image: linear-gradient(90deg, #333333 5%, #0000 0 95%, #333333 0)
          10;
      }
    </style>
    <div class="flex relative">
      <ol class="flex-grow px-2">
        <li *ngFor="let item of items">
          <bombos-list-item
            class="block"
            [item]="item"
            [open]="openItemId === item.id"
            (click)="openEvent.emit(item.id)"
            (edit)="edit.emit(item)"
            (delete)="delete.emit(item.id)"
          />
        </li>
      </ol>
      <button
        class="font-medium hover:underline px-3"
        (click)="groupAdd.emit()"
      >
        <bombos-icon name="plus" />
      </button>
    </div>
  `,
  imports: [ListItemComponent, NgForOf, IconComponent],
})
export class ListItemsComponent {
  @Input() items: (ShoppingItem & Id)[] = [];

  @Output() edit = new EventEmitter<ShoppingItem & Id>();
  @Output() delete = new EventEmitter<string>();

  @Input() openItemId = '';
  @Output() openEvent = new EventEmitter<string>();
  @Output() groupAdd = new EventEmitter();
}

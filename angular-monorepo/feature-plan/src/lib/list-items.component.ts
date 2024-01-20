import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Id, ShoppingItem } from '@bombos/data-access';
import { ListItemComponent } from './list-item.component';

@Component({
  standalone: true,
  selector: 'bombos-list-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <style>
      ol:before {
        content: '';
        pointer-events: none;
        position: absolute;
        inset: -2px;
        border: 2px solid #0000;
        border-image: linear-gradient(90deg, #333333 5%, #0000 0 95%, #333333 0)
          10;
      }
    </style>
    <ol class="relative px-2 mb-2">
      <li *ngFor="let item of items">
        <bombos-list-item
          class="block"
          [item]="item"
          [open]="openItemId === item.id"
          (click)="openItemId = item.id"
          (edit)="edit.emit(item)"
          (delete)="delete.emit(item.id)"
        />
      </li>
    </ol>
  `,
  imports: [ListItemComponent, NgForOf],
})
export class ListItemsComponent {
  @Input() items: (ShoppingItem & Id)[] = [];
  openItemId = '';

  @Output() edit = new EventEmitter<ShoppingItem & Id>();
  @Output() delete = new EventEmitter<string>();
}

import { IconComponent } from '@angular-monorepo/ui';
import { NgClass, NgForOf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconType } from '../../../ui/src/lib/icon.component';

export type TabName = 'collect' | 'send';
export interface TabItem {
  name: TabName;
  icon: IconType;
}

@Component({
  standalone: true,
  selector: 'bombos-navigation-tabs',
  template: `
    <div class="inline-flex rounded-md shadow-sm w-full" role="group">
      <button
        *ngFor="let tab of tabs; let i = index"
        type="button"
        class="w-full border justify-center capitalize inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white     "
        [ngClass]="{
          'bg-gray-900 text-white': tab.name === selected,
          'rounded-s-lg': i === 0,
          'border-t border-b': i > 0 && i < tabs.length - 1,
          'rounded-e-lg': i === tabs.length - 1
        }"
        (click)="tab.name !== selected && select.emit(tab.name)"
      >
        <bombos-icon class="mr-2" [name]="tab.icon"></bombos-icon>
        {{ tab.name }}
      </button>
    </div>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, NgClass, IconComponent],
})
export class NavigationTabsComponent {
  @Input() selected: TabName = 'collect';
  @Output() select = new EventEmitter<TabName>();

  tabs: TabItem[] = [
    { name: 'collect', icon: 'collect' },
    { name: 'send', icon: 'send' },
  ];
}

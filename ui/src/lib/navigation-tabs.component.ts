import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { IconComponent, IconType } from './icon.component';

export interface TabItem {
  name: string;
  icon: IconType;
  display: string;
}

@Component({
  standalone: true,
  selector: 'bombos-navigation-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, IconComponent],
  template: `
    @for (tab of tabs(); track tab; let i = $index) {
    <button
      type="button"
      class="w-full border justify-center capitalize inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white     "
      [ngClass]="{
        'bg-gray-900 text-white': tab.name === selected(),
        'rounded-s-lg': i === 0,
        'border-t border-b': i > 0 && i < tabs().length - 1,
        'rounded-e-lg': i === tabs().length - 1
      }"
      (click)="tab.name !== selected() && select.emit(tab.name)"
    >
      <bombos-icon class="mr-2" [name]="tab.icon"></bombos-icon>
      {{ tab.display }}
    </button>
    }
  `,
})
export class NavigationTabsComponent {
  @HostBinding('class') _ = 'inline-flex rounded-md shadow-sm w-full';

  tabs = input<TabItem[]>([]);
  selected = input<string>('collect');
  select = output<string>();
}

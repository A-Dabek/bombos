import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationTabsComponent, TabItem } from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';

@Component({
  standalone: true,
  selector: 'bombos-cash-view',
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <bombos-navigation-tabs
      class="block mb-2"
      [tabs]="tabs"
      [selected]="activeTab"
      (select)="onTabChange($event)"
    />
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [RouterOutlet, NavigationTabsComponent],
})
export class CashViewComponent {
  readonly tabs = [
    { name: 'plan', icon: 'cash-plan', display: 'Plan' },
    { name: 'balance', icon: 'balance', display: 'Rachunki' },
    { name: 'bills', icon: 'bills', display: 'Wydatki' },
  ] as TabItem[];
  activeTab: string = 'plan';

  onTabChange(tab: string) {
    this.activeTab = tab;
  }
}

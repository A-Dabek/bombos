import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
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
  imports: [RouterOutlet, NavigationTabsComponent, JsonPipe],
})
export class CashViewComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly tabs = [
    { name: 'plan', icon: 'cash-plan', display: 'Plan' },
    { name: 'bills', icon: 'bills', display: 'Rachunki' },
    { name: 'balance', icon: 'balance', display: 'Wydatki' },
  ] as TabItem[];
  activeTab: string = 'plan';

  onTabChange(tab: string) {
    this.activeTab = tab;
    this.router.navigate([tab], { relativeTo: this.route });
  }
}

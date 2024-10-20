import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavigationTabsComponent, TabItem } from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';
import { debounceTime } from 'rxjs';

@Component({
  standalone: true,
  selector: 'bombos-cash-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavigationTabsComponent, JsonPipe],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <bombos-navigation-tabs
      class="block mb-2"
      [tabs]="tabs"
      [selected]="activeTab()"
      (select)="onTabChange($event)"
    />
    <router-outlet></router-outlet>
  `,
})
export class CashViewComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly tabs = [
    { name: 'plan', icon: 'cash-plan', display: 'Plan' },
    { name: 'bills', icon: 'bills', display: 'Rachunki' },
    { name: 'balance', icon: 'balance', display: 'Wydatki' },
  ] as TabItem[];
  readonly activeTab = signal('plan');

  private readonly routeSub = this.router.events
    .pipe(takeUntilDestroyed(), debounceTime(50))
    .subscribe(() => {
      const currentUrl = this.router.url.split('/').pop();
      if (currentUrl && this.tabs.some((tab) => tab.name === currentUrl)) {
        this.activeTab.set(currentUrl);
      }
    });

  onTabChange(tab: string) {
    this.router.navigate([tab], { relativeTo: this.route });
  }
}

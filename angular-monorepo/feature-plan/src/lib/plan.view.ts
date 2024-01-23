import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconComponent } from '@bombos/ui';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';

@Component({
  standalone: true,
  selector: 'bombos-plan-view',
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: `
    <router-outlet></router-outlet>
    <div class="fixed bottom-3 left-3">
      <button
        [routerLink]="'admin'"
        class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2 me-2 mb-2"
      >
        <bombos-icon name="admin" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [RouterOutlet, IconComponent, RouterLink],
})
export class PlanViewComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  bounceInRightOnEnterAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';

@Component({
  selector: 'bombos-plan-view',
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
    expandOnEnterAnimation({ anchor: 'enterItem' }),
    collapseOnLeaveAnimation({ anchor: 'leaveItem' }),
  ],
  template: ` <router-outlet></router-outlet> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [RouterOutlet],
})
export class PlanViewComponent {}

import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { bounceInRightOnEnterAnimation } from 'angular-animations';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-plan-view',
  imports: [],
  providers: [],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: ` <div class="relative h-screen"></div> `,
})
export class PlanViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';
}

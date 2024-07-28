import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { bounceInRightOnEnterAnimation } from 'angular-animations';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bombos-balance-view',
  imports: [],
  providers: [],
  animations: [
    bounceInRightOnEnterAnimation({ anchor: 'enterView', duration: 500 }),
  ],
  template: ` <div class="relative h-screen"></div> `,
})
export class BalanceViewComponent {
  @HostBinding('@enterView') _ = true;
  @HostBinding('class') __ = 'block';
}

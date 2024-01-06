import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'bombos-deliveries-view',
  template: `
    <nav>
      <ul>
        <li>In</li>
        <li>Out</li>
      </ul>
    </nav>
    <div></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveriesViewComponent {}

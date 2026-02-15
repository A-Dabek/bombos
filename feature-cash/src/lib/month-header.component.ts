import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimestampPipe } from './timestamp.pipe';

@Component({
  selector: 'bombos-month-header',
  imports: [DatePipe, TimestampPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-between">
      <label class="capitalize font-semibold text-sm">
        15 {{ periodTimestamp() | timestamp | date : 'MMMM' : '' : 'pl' }} - 14
        {{ periodTimestamp() | timestamp : 1 | date : 'MMMM y' : '' : 'pl' }}
      </label>
    </div>
  `,
})
export class MonthHeaderComponent {
  periodTimestamp = input(0);
}

import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TimestampPipe } from './timestamp.pipe';

@Component({
  selector: 'bombos-month-header',
  standalone: true,
  imports: [DatePipe, TimestampPipe],
  template: `
    <div class="flex justify-between">
      <label class="capitalize font-semibold text-sm">
        20 {{ periodTimestamp | timestamp | date : 'MMMM' : '' : 'pl' }} - 19
        {{ periodTimestamp | timestamp : 1 | date : 'MMMM y' : '' : 'pl' }}
      </label>
    </div>
  `,
})
export class MonthHeaderComponent {
  @Input() periodTimestamp = 0;
}

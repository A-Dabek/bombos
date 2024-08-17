import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(timestamp: number, monthAdd = 0) {
    const date = new Date();
    date.setFullYear(Math.floor(timestamp / 10));
    date.setMonth((timestamp % 10) + monthAdd);
    return date;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(timestamp: number, monthAdd = 0) {
    const date = new Date();
    date.setFullYear(Math.floor(timestamp / 100));
    date.setMonth((timestamp % 100) + monthAdd);
    return date;
  }
}

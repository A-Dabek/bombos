import { Injectable } from '@angular/core';
import { BehaviorSubject, map, startWith, switchMap, timer } from 'rxjs';

@Injectable()
export class ErrorService {
  private readonly error = new BehaviorSubject('');

  readonly error$ = this.error.pipe(
    switchMap((message) => {
      return timer(5000).pipe(
        map(() => {
          return '';
        }),
        startWith(message)
      );
    })
  );

  raiseError(message: string) {
    this.error.next(message);
  }
}

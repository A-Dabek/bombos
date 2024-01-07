import { ErrorComponent } from '@angular-monorepo/ui';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorService } from '../../../../ui/src/lib/error.service';
import { FirebaseModule } from '../firebase.module';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    FirebaseModule,
    ErrorComponent,
    NgIf,
    AsyncPipe,
    JsonPipe,
  ],
  providers: [ErrorService],
  selector: 'bombos-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly errorService: ErrorService = inject(ErrorService);
  readonly error$ = this.errorService.error$;
}

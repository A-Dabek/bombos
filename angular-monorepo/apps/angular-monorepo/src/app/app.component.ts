import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FirebaseModule } from '../firebase.module';

@Component({
  standalone: true,
  imports: [RouterModule, FirebaseModule],
  selector: 'bombos-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}

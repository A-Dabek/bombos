import {AsyncPipe, JsonPipe} from "@angular/common";
import {Component, inject} from '@angular/core';
import {collection, collectionData, Firestore} from "@angular/fire/firestore";
import {RouterModule} from '@angular/router';
import {FirebaseModule} from "../firebase.module";
import {NxWelcomeComponent} from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    FirebaseModule,
    AsyncPipe,
    JsonPipe,
  ],
  selector: 'angular-monorepo-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-monorepo';
  firestore: Firestore = inject(Firestore);
  itemCollection = collection(this.firestore, 'test');
  item$ = collectionData(this.itemCollection);
}

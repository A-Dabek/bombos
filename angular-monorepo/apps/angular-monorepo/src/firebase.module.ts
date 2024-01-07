import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  imports: [
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyAb_kAPmTsh-9qiDOPGYT5Zn5QjMI6RjDU',
        authDomain: 'bombos-1f119.firebaseapp.com',
        projectId: 'bombos-1f119',
        storageBucket: 'bombos-1f119.appspot.com',
        messagingSenderId: '254880634541',
        appId: '1:254880634541:web:6e0a9a38b942215dbbd824',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
})
export class FirebaseModule {}

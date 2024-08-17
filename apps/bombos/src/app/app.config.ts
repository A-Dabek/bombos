import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
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
    provideAuth(() => getAuth()),
    importProvidersFrom([BrowserModule, BrowserAnimationsModule]),
  ],
};

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiex_g1RyvPgQLiqcsmKzKgjK-kJg0fi8",
  authDomain: "elmshire-3e15e.firebaseapp.com",
  projectId: "elmshire-3e15e",
  storageBucket: "elmshire-3e15e.appspot.com",
  messagingSenderId: "417318006937",
  appId: "1:417318006937:web:04a2b685996e3f578c0808"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
};

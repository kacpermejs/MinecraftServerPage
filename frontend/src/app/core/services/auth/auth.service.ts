import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, Persistence, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);

  constructor() {
    this.setPersistence({type: 'LOCAL'});
  }

  setPersistence(persistenceMode: Persistence): void {
    this.auth.setPersistence(persistenceMode)
      .then(() => {
        console.log(`Persistence set to ${persistenceMode}`);
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });
  }

  signInWithGoogle() {

    const provider = new GoogleAuthProvider();

    return signInWithPopup(this.auth, provider).then((result) => {
      console.log("Signed in with google!");
      console.log(result);
    });
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential: any) => {
        console.log('User signing in:', userCredential);
      })
      .catch(error => {
        console.error('Error signing in:', error);
        throw error;
      });
  }

  registerWithEmailAndPassword(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential: any) => {
        console.log('User signed up:', userCredential);
      })
      .catch(error => {
        console.error('Error signing up:', error);
        throw error;
      });
  }

  getAuthState(): Observable<any> {
    return authState(this.auth);
  }

  getUserUid(): Observable<string> {
    return (authState(this.auth) as Observable<any>).pipe(
      map(e => e ? e.uid : "")
    );
  }

  signOut() {
    return signOut(this.auth).then(() => {
      console.log('User signed out:');
    })
    .catch(error => {
      console.error('Error signing out:', error);
      throw error;
    });
  }
}

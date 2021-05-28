import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {switchMap} from "rxjs/operators";
import firebase from "firebase";
import {AngularFirestore} from "@angular/fire/firestore";
import {of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

 fireUser: any;

  constructor(private angularFireAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore) {

    this.fireUser = this.angularFireAuth.authState.pipe(
      switchMap(firebaseAuthId => {
        if(firebaseAuthId) {
          return this.angularFirestore.doc(`users/${firebaseAuthId.uid}`).valueChanges();
        }
        else {
          return of(null);
        }
      })
    )
  }

  register() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.angularFireAuth.signInWithPopup(provider);
  }

  createUserDoc(userId) {
    return this.angularFirestore.doc(`users/${userId.uid}`).set(userId);
  }

  authSerLogOut() {
    return this.angularFireAuth.signOut();
  }

}


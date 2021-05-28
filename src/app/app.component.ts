import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSnackBar} from "@angular/material/snack-bar";
import * as firebase from 'firebase/app';
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanban-board';

  kanbanBoard = {
    todo: [
      'Big Moshe',
      'Big Gal'
    ],
    inProcess: [],
    revision: [],
    complete: []
  };

  userApp;
  userSubApp;


  constructor(private snackBar: MatSnackBar,
              private authService: AuthService) {
    this.importData();
  }


  logIn(): any {
    this.authService.register().then((authData) => {


      this.authService.fireUser.subscribe((firebaseUser: any | null) => {
        if(firebaseUser === undefined) {
          this.authService.createUserDoc({
            uid: authData.user.uid,
            name: authData.user.displayName,
            email: authData.user.email,
            photoUrl: authData.user.photoURL
          });
        }
        else {
          this.userApp = firebaseUser;
        }
      });
    });
  }


  appLogOut(): any {
    this.authService.authSerLogOut();
  }

  saveTimerCnt: number = 0;
  autoSaveTimeOut = null;

autoSaveTimerInterval = null;
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.autoSaveData();
  }


  autoSaveData() {
    if(this.autoSaveTimerInterval) {
      clearInterval(this.autoSaveTimerInterval);
      this.saveTimerCnt = 0;
    }
    this.autoSaveTimerInterval = setInterval(() => {

      this.saveTimerCnt++;


      if(this.saveTimerCnt >= 100) {
        clearInterval(this.autoSaveTimerInterval);
        this.saveTimerCnt = 0;
      }

    },100)

    if(this.autoSaveTimeOut) {
      clearTimeout(this.autoSaveTimeOut);
    }
    this.autoSaveTimeOut = setTimeout(() => {
      this.saveData();
    }, 1000);
  }

  saveData() {
    localStorage.setItem('kanban-board', JSON.stringify(this.kanbanBoard));
    this.snackBar.open('Success!', null, {duration: 3000});

  }

  importData() {
    const isDataLocalStorage = localStorage.getItem('kanban-board');
    if(isDataLocalStorage) {
      this.kanbanBoard =  JSON.parse(isDataLocalStorage)
    }
  }



}

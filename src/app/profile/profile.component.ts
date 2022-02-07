import { Component, OnInit } from '@angular/core';
import {Observable, tap} from "rxjs";
import {select, Store} from "@ngrx/store";
import { User } from "../user";
import { selectUserInfo } from "../store";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // TODO: Make this an object, not an observable?
  user$: Observable<User | null> = new Observable<User>()

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(selectUserInfo));
    this.user$.pipe(tap(user => console.log(user))).subscribe()
    // this.user$.pipe(tap(user => this.user = user)).subscribe()
  }

}

import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {checkAuth, login, logout, selectIsAuthenticated} from "./store";
import {select, Store} from "@ngrx/store";
import {CsrfService} from "./csrf.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<any>, private csrf: CsrfService) {}

  ngOnInit() {
    this.csrf.getToken();
    this.store.dispatch(checkAuth());
  }

}

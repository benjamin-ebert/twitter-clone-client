import {Component, OnInit} from '@angular/core';
import {checkAuth } from "./store";
import { Store} from "@ngrx/store";
import { CsrfService } from "./csrf.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'twitter-clone';

  constructor(private store: Store<any>, private csrf: CsrfService) {}

  ngOnInit() {
    this.store.dispatch(checkAuth());
  }

}

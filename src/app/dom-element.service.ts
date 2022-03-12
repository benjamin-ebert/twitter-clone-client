import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DomElementService {

  scrolledToFeedEnd$ = new BehaviorSubject<boolean>(false);
  scrolledToProfileEnd$ = new BehaviorSubject<boolean>(false);

  constructor() { }
}

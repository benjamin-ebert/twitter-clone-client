import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DomElementService {

  // TODO: Move this to some sort of elements service?
  scrolledToFeedEnd$ = new BehaviorSubject<boolean>(false);

  constructor() { }
}

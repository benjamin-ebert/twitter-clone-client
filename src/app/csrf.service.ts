import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CsrfService {

  csrfTokenUrl: string = '/csrf';

  constructor(private http: HttpClient) {}

  requestToken(): Observable<any> {
    return this.http.get(this.csrfTokenUrl, {observe: 'response'})
      .pipe(catchError(err => throwError(err)))
  }
}

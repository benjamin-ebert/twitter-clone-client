import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CsrfService {

  csrfTokenUrl: string = '/csrf';
  // The current CSRF Token of the SPA. Set by this.getToken(), read by the CSRF interceptor.
  csrfToken: string | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Get a new CSRF-Token from the Golang backend API.
   * Only called in AppComponent's ngOnInit.
   */
  getToken(): void {
    this.http.get<HttpEvent<any>>(this.csrfTokenUrl, {observe: 'response'})
      .pipe(catchError(err => throwError(err)))
      .subscribe(res => this.csrfToken = res.headers.get("X-CSRF-Token"));
  }

  requestToken(): Observable<any> {
    return this.http.get<HttpEvent<any>>(this.csrfTokenUrl, {observe: 'response'})
      .pipe(catchError(err => throwError(err)))
  }
}

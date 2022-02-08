import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CsrfService {

  // The current CSRF Token of the SPA.
  // Only written by this.getToken().
  // Only read by the CSRF interceptor.
  // TODO: Have this in store?
  token: string | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Get a new CSRF-Token from the Golang backend API.
   * Only called in AppComponent's ngOnInit.
   */
  getToken(): void {
    // this.http.get<HttpEvent<any>>("api/csrf", { observe:'response' })
    //   .pipe(tap(res => {
    //     this.token = res.headers.get("X-CSRF-Token");
    //   })).subscribe()

    this.http.get<HttpEvent<any>>("api/csrf", {observe: 'response'})
      .subscribe((res) => {
        this.token = res.headers.get("X-CSRF-Token");
      });
  }
}

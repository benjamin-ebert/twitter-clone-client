import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable, switchMap } from "rxjs";
import { CsrfService } from "../csrf.service";

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  constructor(private csrfService: CsrfService) { }

  /**
   * Intercepts any request that's not a GET request.
   * Gets a new CSRF-Token from the server, puts it into the request header and proceeds.
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // If it's a GET request, do nothing (GETs don't need a CSRF-Token).
    if (request.method === "GET") return next.handle(request);

    // Otherwise, get a new CSRF-Token from the server, put it into the header of
    // the original request and proceed. Use switchMap to get the response of the
    // token request, in order to return an Observable<HttpEvent<any>> which
    // satisfies the HttpInterceptor interface.
    return this.csrfService.requestToken().pipe(
      switchMap(tokenResponse => {
        request = request.clone({
          setHeaders: { "X-CSRF-Token": tokenResponse.headers.get("X-CSRF-Token") }
        })
        return next.handle(request)
      })
    )
  }
}

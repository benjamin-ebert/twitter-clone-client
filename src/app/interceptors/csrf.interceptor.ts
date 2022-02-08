import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { CsrfService } from "../csrf.service";

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient, private csrf: CsrfService) { }

  /**
   * Intercepts any request that's not a GET request.
   * Retrieves the current CSRF Token from CsrfService,
   * puts it into the request header and proceeds.
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // If it's a GET request, do nothing (GETs don't need a CSRF Token).
    if (req.method === "GET") {
      return next.handle(req)
    }

    // If we have no CSRF Token, do nothing (the backend will reject us).
    if (this.csrf.token === null) {
      return next.handle(req)
    }

    // Otherwise, put the current CSRF Token into the request header and proceed.
    req = req.clone({
      setHeaders: {"X-CSRF-Token": this.csrf.token},
    })

    return next.handle(req)
  }
}

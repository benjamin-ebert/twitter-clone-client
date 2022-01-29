import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable, tap} from "rxjs";

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  csrfToken: string | null = null;

  constructor(private http: HttpClient) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.method === "GET") {
      return next.handle(req)
    }

    return this.http.get<HttpEvent<any>>("api/csrf", { observe:'response' })
      .pipe(tap(res => {
        this.csrfToken = res.headers.get("X-CSRF-Token");

        if (this.csrfToken === null) {
          return next.handle(req)
        }

        const modifiedRequest = req.clone({
          setHeaders: {"X-CSRF-Token": this.csrfToken},
        });

        return next.handle(modifiedRequest).subscribe();
      }))
  }
}

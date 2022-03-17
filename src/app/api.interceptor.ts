import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Add the /api prefix to the url on every request, so we're actually calling the api.
    // Avoids having to set the prefix in all the service url declarations.
    request = request.clone({
      url: '/api' + request.url,
    })

    return next.handle(request);
  }
}

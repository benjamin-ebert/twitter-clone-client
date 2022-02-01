import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // Constant values of backend API routes relevant to authentication.
  private loginUrl = 'api/login';
  private logoutUrl = 'api/logout';
  private profileUrl = 'api/profile';
  private isLoggedInUrl = 'api/is_logged_in'

  // TODO: Remove the catchError stuff?

  /**
   * Takes a user object consisting of email and password,
   * and posts that data to the backend's login route.
   * On successful login, the authed user's full data get
   * returned as a user object.
   * @param user
   */
  login(user: User): Observable<User> {
    return this.http.post<User>(this.loginUrl, user)
      .pipe(
        catchError(this.handleError<User>('login'))
      );
  }

  /**
   * Makes a post request to the backend's logout route.
   * Backend invalidates the browser's remember_token cookie
   * and the user gets logged out of the backend as a result.
   * Subsequent SPA login checks in the auth store will then
   * fail, and the user gets logged out of the SPA as well.
   */
  logout(): Observable<any> {
    return this.http.post<any>(this.logoutUrl, {})
      .pipe(
        catchError(this.handleError<any>('logout'))
      )
  }

  /**
   * Gets the authed user's full data from the backend.
   */
  profile(): Observable<User> {
    return this.http.get<User>(this.profileUrl)
      .pipe(
        catchError(this.handleError<User>('profile'))
      );
  }

  /**
   * Quickly asks the backend if we are authenticated.
   * Backend just returns true or false.
   */
  isLoggedIn(): Observable<boolean> {
    return this.http.get<boolean>(this.isLoggedInUrl)
      .pipe(
        catchError(this.handleError<boolean>('is logged in'))
      )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.log(error);
      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);
      console.log(error.message);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }
}

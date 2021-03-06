import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, finalize, Observable, of, tap} from "rxjs";
import { catchError, throwError } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private env = environment;
  public signingUp$ = new BehaviorSubject<boolean>(false);
  public signingIn$ = new BehaviorSubject<boolean>(false);

  private registerUrl = '/register';
  private loginUrl = '/login';
  private logoutUrl = '/logout';
  private userInfoUrl = '/user';
  private isLoggedInUrl = '/is_logged_in';
  private oauthGithubUrl = '/oauth/github/connect';

  constructor(private http: HttpClient) { }

  /**
   * Takes a user object consisting of name, handle,
   * email and password, and posts that data to the backend's
   * register route. On successful registration, the new
   * user's full data get returned as a user object.
   * @param user
   */
  register(user: User): Observable<User> {
    this.signingUp$.next(true)
    return this.http.post<User>(this.registerUrl, user)
      .pipe(
        finalize(() => this.signingUp$.next(false)),
        catchError(err => throwError(err))
      );
  }

  /**
   * Takes a user object consisting of email and password,
   * and posts that data to the backend's login route.
   * On successful login, the authed user's full data get
   * returned as a user object.
   * @param user
   */
  login(user: User): Observable<User> {
    this.signingIn$.next(true)
    return this.http.post<User>(this.loginUrl, user)
      .pipe(
        finalize(() => this.signingIn$.next(false)),
        catchError(err => throwError(err))
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
      .pipe(catchError(err => throwError(err)))
  }

  /**
   * Gets the authed user's full data from the backend.
   */
  userInfo(): Observable<User> {
    return this.http.get<User>(this.userInfoUrl)
      .pipe(catchError(err => throwError(err)));
  }

  /**
   * Quickly asks the backend if we are authenticated.
   * Backend just returns true or false.
   */
  isLoggedIn(): Observable<boolean> {
    return this.http.get<boolean>(this.isLoggedInUrl)
      .pipe(catchError(err => throwError(err)))
  }

  /**
   * Call the api endpoint that will prepare the oauth process, which will redirect
   * the user to Github where they can agree to sign in here with their Github account.
   */
  oauthGithubLogin(): void {
     window.location.href = this.env.serverUrl + '/api' + this.oauthGithubUrl
  }
}

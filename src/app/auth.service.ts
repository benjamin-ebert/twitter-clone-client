import { Injectable } from '@angular/core';
import { User } from "./user";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private loginUrl = 'api/login';

  // TODO: Add useful comment.
  // TODO: Remove console.logs

  login(user: User): Observable<User> {
    return this.http.post<User>(this.loginUrl, user)
      .pipe(
        // tap((authedUser: User) => console.log(authedUser)),
        catchError(this.handleError<User>('login'))
      );
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

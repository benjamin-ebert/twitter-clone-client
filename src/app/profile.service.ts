import { Injectable } from '@angular/core';
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import { User } from "./user";
import { HttpClient } from "@angular/common/http";
import {Tweet} from "./tweet";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  private profileUrl = 'api/profile';
  private allTweetsUrl = 'api/tweets/all';
  private imageTweetsUrl = 'api/tweets/with_images';
  private likedTweetsUrl = 'api/tweets/liked';
  private emitChange = new Subject<any>();
  profileState$ = this.emitChange.asObservable();

  emitProfileChange(profile: User): void {
    this.emitChange.next(profile)
  }

  getProfile(userId: number): Observable<User> {
    return this.http.get<User>(this.profileUrl + '/' + userId)
      .pipe(
        tap((profile) => this.emitProfileChange(profile)),
        // TODO: Is this good?
        catchError(err => throwError(err))
      );
  }

  getAllTweetsOfUser(userId: number): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.allTweetsUrl + '/' + userId)
      .pipe(catchError(err => throwError(err)));
  }

  getImageTweetsOfUser(userId: number): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.imageTweetsUrl + '/' + userId)
      .pipe(catchError(err => throwError(err)));
  }

  getLikedTweetsOfUser(userId: number): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.likedTweetsUrl + '/' + userId)
      .pipe(catchError(err => throwError(err)));
  }
}

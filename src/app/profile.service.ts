import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, tap, catchError, throwError} from "rxjs";
import { User } from "./user";
import { Tweet } from "./tweet";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  private getProfileUrl = '/profile';
  private updateProfileUrl = '/profile/update';
  private uploadUserImageUrl = '/upload/user';
  private originalTweetsUrl = '/tweets/original';
  private allTweetsUrl = '/tweets/all';
  private imageTweetsUrl = '/tweets/with_images';
  private likedTweetsUrl = '/tweets/liked';

  profileState$ = new Subject<User>();

  getProfile(userId: number): Observable<User> {
    return this.http.get<User>(this.getProfileUrl + '/' + userId)
      .pipe(
        tap(profile => this.profileState$.next(profile)),
        catchError(err => throwError(err))
      );
  }

  updateProfile(user: User): Observable<User> {
    return this.http.put<User>(this.updateProfileUrl, user)
      .pipe(
        catchError(err => throwError(err))
      )
  }

  uploadUserImage(image: File, imageType: string): Observable<User> {
    const data = new FormData();
    data.append('image', image);
    return this.http.post<User>(this.uploadUserImageUrl + '/' + imageType, data)
      .pipe(catchError(err => throwError(err)))
  }

  getOriginalTweets(userId: number, offset: number = 0): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.originalTweetsUrl + '/' + userId + '/' + offset)
      .pipe(catchError(err => throwError(err)));
  }

  getAllTweets(userId: number, offset: number = 0): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.allTweetsUrl + '/' + userId + '/' + offset)
      .pipe(catchError(err => throwError(err)));
  }

  getImageTweets(userId: number, offset: number = 0): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.imageTweetsUrl + '/' + userId + '/' + offset)
      .pipe(catchError(err => throwError(err)));
  }

  getLikedTweets(userId: number, offset: number = 0): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.likedTweetsUrl + '/' + userId + '/' + offset)
      .pipe(catchError(err => throwError(err)));
  }
}

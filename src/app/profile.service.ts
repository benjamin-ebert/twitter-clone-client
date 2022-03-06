import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap, catchError, throwError } from "rxjs";
import { User } from "./user";
import { Tweet } from "./tweet";
import { Follow } from "./follow";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  private getProfileUrl = 'api/profile';
  private updateProfileUrl = 'api/profile/update';
  private uploadUserImageUrl = 'api/upload/user';
  private allTweetsUrl = 'api/tweets/all';
  private imageTweetsUrl = 'api/tweets/with_images';
  private likedTweetsUrl = 'api/tweets/liked';
  private followUserUrl = 'api/follow';
  private unfollowUserUrl = 'api/unfollow';

  profileState$ = new BehaviorSubject<User|null>(null)

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

  followUser(userId: number): Observable<Follow> {
    return this.http.post<Follow>(this.followUserUrl + '/' + userId, null)
      .pipe(catchError(err => throwError(err)));
  }

  unfollowUser(userId: number): Observable<any> {
    return this.http.delete(this.unfollowUserUrl + '/' + userId)
      .pipe(catchError(err => throwError(err)));
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

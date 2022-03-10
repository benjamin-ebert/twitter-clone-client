import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap, catchError, throwError } from "rxjs";
import { Follow } from "./follow";
import { User } from "./user";

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private createFollowUrl = 'api/follow';
  private deleteFollowUrl = 'api/follow/delete';

  constructor(private http: HttpClient) { }

  createFollow(follow: Follow): Observable<Follow> {
    return this.http.post<Follow>(this.createFollowUrl, follow)
      .pipe(catchError(err => throwError(err)));
  }

  deleteFollow(followId: number): Observable<any> {
    return this.http.delete(this.deleteFollowUrl + '/' + followId, { observe: 'response' })
      .pipe(catchError(err => throwError(err)));
  }

  follow(user: User): void {
    const follow = { followed_id: user.id } as Follow;
    this.createFollow(follow)
      .pipe(tap(follow => {
        if (follow) {
          user.auth_follow = follow;
          user.follower_count++;
        }
      }))
      .subscribe()
  }

  unfollow(user: User): void {
    this.deleteFollow(user.auth_follow!.id)
      .pipe(tap(res => {
        if (res.status === 204) {
          user.auth_follow = null;
          user.follower_count--;
        }
      }))
      .subscribe()
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse} from "@angular/common/http";
import { Like } from "./like";
import { Tweet } from "./tweet";
import { Observable, tap, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private createLikeUrl = 'api/like';
  private deleteLikeUrl = 'api/like/delete';

  constructor(private http: HttpClient) { }

  createLike(like: Like): Observable<Like> {
    return this.http.post<Like>(this.createLikeUrl, like)
      .pipe(catchError(err => throwError(err)));
  }

  deleteLike(likeId: number): Observable<HttpResponse<any>> {
    return this.http.delete(this.deleteLikeUrl + '/' + likeId, { observe: 'response' })
      .pipe(catchError(err => throwError(err)));
  }

  like(tweet: Tweet): void {
    const like = { tweet_id: tweet.id } as Like;
    console.log(like)
    this.createLike(like)
      .pipe(tap(like => {
        if (like) {
          tweet.likes_count++;
          tweet.auth_like = like;
        }
      }))
      .subscribe();
  }

  unlike(tweet: Tweet): void {
    this.deleteLike(tweet.auth_like!.id)
      .pipe(tap(res => {
        if (res.status === 204) {
          tweet.likes_count--;
          tweet.auth_like = null;
        }
      }))
      .subscribe();
  }
}

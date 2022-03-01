import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, catchError, throwError, tap } from "rxjs";
import { Tweet } from "./tweet";
import { Like } from "./like";
import { TweetDialogComponent } from "./tweet-dialog/tweet-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  private getTweetUrl = 'api/tweet';
  private createTweetUrl = 'api/tweet';
  private uploadTweetImagesUrl = 'api/upload/tweet';
  private deleteTweetUrl = 'api/tweet/delete';
  // private deleteRetweetUrl = 'api/retweet/delete';
  private likeTweetUrl = 'api/like';
  private unlikeTweetUrl = 'api/unlike';

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  // TODO: Put get tweet methods from profileService into here?
  getTweet(tweetId: number): Observable<Tweet> {
    return this.http.get<Tweet>(this.getTweetUrl + '/' + tweetId)
      .pipe(catchError(err => throwError(err)));
  }

  createTweet(tweet: Tweet): Observable<Tweet> {
    return this.http.post<Tweet>(this.createTweetUrl, tweet)
      .pipe(catchError(err => throwError(err)));
  }

  uploadTweetImages(images: File[], tweetId: number): Observable<Tweet> {
    const data = new FormData();
    for (let image of images) {
      data.append('images', image);
    }
    return this.http.post<Tweet>(this.uploadTweetImagesUrl + '/' + tweetId, data)
      .pipe(catchError(err => throwError(err)));
  }

  openReplyDialog(replyTo: Tweet | null): MatDialogRef<TweetDialogComponent> {
    return this.dialog.open(TweetDialogComponent, {
      data: { repliesTo: replyTo},
      autoFocus: false,
      position: { top: '5%' },
      width: '600px',
    })
  }

  retweet(tweet: Tweet): void {
    const retweet = { retweets_id: tweet.id } as Tweet
    this.createTweet(retweet)
      .pipe(tap((retweet) => {
        tweet.retweets_count++;
        tweet.auth_retweet = retweet
      }))
      .subscribe();
  }

  undoRetweet(tweet: Tweet): void {
    this.deleteTweet(tweet.auth_retweet!.id)
      .pipe(tap(res => {
        if (res.status === 204) {
          tweet.retweets_count--;
          tweet.auth_retweet = null;
        }
      }))
      .subscribe();
  }

  like(tweet: Tweet): Observable<Like> {
    // TODO: Create this the same way you create a retweet.
    return this.http.post<Like>(this.likeTweetUrl + '/' + tweet.id, null)
      .pipe(
        tap(like => {
          tweet.likes_count++;
          tweet.auth_likes = true
        }),
        catchError(err => throwError(err))
      );
  }

  unlike(tweet: Tweet): Observable<HttpResponse<any>> {
    // TODO: Delete this the same way you delete a tweet?
    return this.http.delete(this.unlikeTweetUrl + '/' + tweet.id, { observe: 'response'})
      .pipe(
        tap(res => {
          if (res.status === 204) {
            tweet.likes_count--;
            tweet.auth_likes = false;
          }
        }),
        catchError(err => throwError(err))
      );
  }

  // likeTweet(tweetId: number): Observable<HttpResponse<Like>> {
  //   return this.http.post<Like>(this.likeTweetUrl + '/' + tweetId, null, { observe: 'response' })
  //     .pipe(catchError(err => throwError(err)));
  // }

  // unlikeTweet(tweetId: number): Observable<any> {
  //   return this.http.delete(this.unlikeTweetUrl + '/' + tweetId, { observe: 'response'})
  //     .pipe(catchError(err => throwError(err)));
  // }

  deleteTweet(tweetId: number): Observable<HttpResponse<any>> {
    return this.http.delete(this.deleteTweetUrl + '/' + tweetId, { observe: 'response' })
      .pipe(catchError(err => throwError(err)));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import {Observable, catchError, throwError, tap, BehaviorSubject} from "rxjs";
import { Tweet } from "./tweet";
import { TweetDialogComponent } from "./tweet-dialog/tweet-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  private getFeedUrl = 'api/feed';
  private getTweetUrl = 'api/tweet'; // GET
  private createTweetUrl = 'api/tweet'; // POST
  private uploadTweetImagesUrl = 'api/upload/tweet';
  private deleteTweetUrl = 'api/tweet/delete';

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  getFeed(offset: number = 0): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.getFeedUrl + '/' + offset)
      .pipe(catchError(err => throwError(err)));
  }

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
    const retweet = { retweets_id: tweet.id } as Tweet;
    this.createTweet(retweet)
      .pipe(tap((retweet) => {
        if (retweet) {
          tweet.retweets_count++;
          tweet.auth_retweet = retweet;
        }
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

  deleteTweet(tweetId: number): Observable<HttpResponse<any>> {
    return this.http.delete(this.deleteTweetUrl + '/' + tweetId, { observe: 'response' })
      .pipe(catchError(err => throwError(err)));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Tweet } from "./tweet";
import { Like } from "./like";
import { TweetDialogComponent } from "./tweet-dialog/tweet-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  private getTweetUrl = 'api/tweet';
  private createTweetUrl = 'api/tweet';
  private uploadTweetImagesUrl = 'api/upload/tweet';
  private likeTweetUrl = 'api/like';
  private unlikeTweetUrl = 'api/unlike';

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

  likeTweet(tweetId: number): Observable<HttpResponse<Like>> {
    return this.http.post<Like>(this.likeTweetUrl + '/' + tweetId, null, { observe: 'response' })
      .pipe(catchError(err => throwError(err)));
  }

  unlikeTweet(tweetId: number): Observable<any> {
    return this.http.delete(this.unlikeTweetUrl + '/' + tweetId, { observe: 'response'})
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
}

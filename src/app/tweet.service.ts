import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Tweet} from "./tweet";
import {finalize, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  constructor(private http: HttpClient) { }

  private createTweetUrl = 'api/tweet'

  createTweet(tweet: Tweet): Observable<Tweet> {
    return this.http.post<Tweet>(this.createTweetUrl, tweet)
  }

  // TODO: Put get tweet methods from profileService into here?
}

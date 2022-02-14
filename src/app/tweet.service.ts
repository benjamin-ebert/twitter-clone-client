import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Tweet } from "./tweet";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  constructor(private http: HttpClient) { }

  private createTweetUrl = 'api/tweet'

  // TODO: Put get tweet methods from profileService into here?

  createTweet(tweet: Tweet): Observable<Tweet> {
    return this.http.post<Tweet>(this.createTweetUrl, tweet)
  }

  // uploadTweetImages(images: FileList): Observable<any> {
  uploadTweetImages(images: File[], tweetId: number): Observable<Tweet> {
    const data = new FormData();
    // for (let i = 0; i < images.length; i++) {
    //   data.append('images', images.item(i)!)
    // }
    for (let image of images) {
      data.append('images', image);
    }
    return this.http.post<Tweet>('/api/upload/tweet/' + tweetId, data)
  }

  // uploadTweetImages(images: File[]): Observable<any> {
  //   const data = new FormData();
  //   for (let img of images) {
  //     data.append('images', img)
  //   }
  //   // data.append('images', images)
  //   return this.http.post('/api/upload/tweet/75', data)
  // }
}

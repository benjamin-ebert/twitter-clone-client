import { Component, Input } from '@angular/core';
import { Tweet } from "../tweet";
import {TweetService} from "../tweet.service";
import {concatMap, finalize, pipe, tap} from "rxjs";

@Component({
  selector: 'app-tweet[tweet]',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  @Input() tweet!: Tweet

  constructor(private tweetService: TweetService) { }

  ngOnInit(): void {
  }

  likeTweet(): void {
    this.tweetService.likeTweet(this.tweet.id)
      .pipe(tap((res) => {
        if (res.status == 201) {
          this.tweet.likes_count++;
          this.tweet.auth_likes = true;
        }
      }))
      .subscribe();
  }

  unlikeTweet(): void {
    this.tweetService.unlikeTweet(this.tweet.id)
      .pipe(tap((res) => {
        if (res.status == 204) {
          this.tweet.likes_count--;
          this.tweet.auth_likes = false;
        }
      }))
      .subscribe();
  }

}

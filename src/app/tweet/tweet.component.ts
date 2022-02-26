import { Component, Input } from '@angular/core';
import { Tweet } from "../tweet";
import { TweetService } from "../tweet.service";
import { tap } from "rxjs";

@Component({
  selector: 'app-tweet[tweet]',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  @Input() tweet!: Tweet

  constructor(private tweetService: TweetService) { }

  openReplyDialog(): void {
    const dialogRef = this.tweetService.openReplyDialog(this.tweet)
    dialogRef.afterClosed().subscribe(tweet => {
      if (tweet) {
        this.tweet.replies_count++;
        this.tweet.auth_replied = true;
      }
    })
  }

  // TODO: It's the same in tweet-detail-component. DRY!
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

  // TODO: It's the same in tweet-detail-component. DRY!
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

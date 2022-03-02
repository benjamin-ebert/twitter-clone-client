import { Component, Input } from '@angular/core';
import { Tweet } from "../tweet";
import { TweetService } from "../tweet.service";
import { LikeService } from "../like.service";

@Component({
  selector: 'app-tweet[tweet]',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  @Input() tweet!: Tweet

  constructor(private tweetService: TweetService, private likeService: LikeService) { }

  openReplyDialog(tweet: Tweet): void {
    const dialogRef = this.tweetService.openReplyDialog(tweet)
    dialogRef.afterClosed().subscribe(reply => {
      if (reply) {
        tweet.replies_count++;
        tweet.auth_replied = true;
      }
    })
  }

  retweet(tweet: Tweet): void {
    this.tweetService.retweet(tweet);
  }

  undoRetweet(tweet: Tweet): void {
    this.tweetService.undoRetweet(tweet);
  }

  likeTweet(tweet: Tweet): void {
    this.likeService.like(tweet);
  }

  unlikeTweet(tweet: Tweet): void {
    this.likeService.unlike(tweet)
  }
}

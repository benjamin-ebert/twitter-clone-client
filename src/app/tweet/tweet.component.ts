import { Component, Input } from '@angular/core';
import { Tweet } from "../tweet";
import { TweetService } from "../tweet.service";
import { LikeService } from "../like.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-tweet[tweet]',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  @Input() tweet!: Tweet

  constructor(
    private tweetService: TweetService,
    private likeService: LikeService,
    private _snackBar: MatSnackBar,
    ) { }

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

  // TODO: Duplicate in tweet-detail-component. DRY!
  getTweetLink(tweet: Tweet): string {
    // TODO: Pull the base url from env?
    return 'http://localhost:4200/home/tweet/' + tweet.id;
  }

  openSnackbar(): void {
    this._snackBar.open('Copied to clipboard!', 'OK', { duration: 1500 });
  }
}

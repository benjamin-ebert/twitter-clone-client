import { Component, OnInit } from '@angular/core';
import { Tweet } from "../tweet";
import { TweetService } from "../tweet.service";
import { LikeService } from "../like.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tweet-detail',
  templateUrl: './tweet-detail.component.html',
  styleUrls: ['./tweet-detail.component.scss']
})
export class TweetDetailComponent implements OnInit {
  tweet: Tweet | null = null
  tweetId: number = Number(this.route.snapshot.paramMap.get('tweetId'));

  constructor(
    private tweetService: TweetService,
    private likeService: LikeService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.getTweet();
  }

  getTweet(): void {
    this.tweetService.getTweet(this.tweetId)
      .subscribe(tweet => this.tweet = tweet);
  }

  openReplyDialog(): void {
    const dialogRef = this.tweetService.openReplyDialog(this.tweet)
    dialogRef.afterClosed().subscribe(tweet => {
      if (tweet) this.appendReply(tweet)
    })
  }

  appendReply(tweet: Tweet | null): void {
    if (tweet) {
      this.tweet!.replies.push(tweet);
      this.tweet!.replies_count++;
      this.tweet!.auth_replied = true;
    }
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
    this.likeService.unlike(tweet);
  }

  // TODO: Duplicate in tweet-component. DRY!
  getTweetLink(tweet: Tweet): string {
    // TODO: Pull the base url from env?
    return 'http://localhost:4200/home/tweet/' + tweet.id;
  }

  openSnackbar(): void {
    this._snackBar.open('Copied to clipboard!', 'OK', { duration: 1500 });
  }
}

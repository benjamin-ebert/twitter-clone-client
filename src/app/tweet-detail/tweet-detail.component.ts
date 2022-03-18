import { Component, OnInit } from '@angular/core';
import { Tweet } from "../tweet";
import { TweetService } from "../tweet.service";
import { LikeService } from "../like.service";
import { SnackbarService } from "../snackbar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-tweet-detail',
  templateUrl: './tweet-detail.component.html',
  styleUrls: ['./tweet-detail.component.scss']
})
export class TweetDetailComponent implements OnInit {
  env = environment;
  tweet: Tweet | null = null;
  tweetId: number = Number(this.route.snapshot.paramMap.get('tweetId'));

  constructor(
    private tweetService: TweetService,
    private likeService: LikeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService
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

  getTweetUrl(tweet: Tweet): string {
    return this.tweetService.getTweetUrl(tweet)
  }

  openSnackbar(): void {
    this.snackbarService.openSnackBar('Copied to clipboard!');
  }
}

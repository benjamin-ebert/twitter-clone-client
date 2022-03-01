import { Component, OnInit } from '@angular/core';
import { Tweet } from "../tweet";
import { TweetService } from "../tweet.service";
import { ActivatedRoute, Router } from "@angular/router";

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
    private route: ActivatedRoute,
    private router: Router,
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
    this.tweetService.like(tweet).subscribe()
  }

  unlikeTweet(tweet: Tweet): void {
    this.tweetService.unlike(tweet).subscribe()
  }
}

import { Component, OnInit } from '@angular/core';
import { Tweet } from "../tweet";
import { TweetService } from "../tweet.service";
import { ActivatedRoute, Router } from "@angular/router";
import { tap } from "rxjs";

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

  // TODO: It's the same in tweet-component. DRY!
  likeTweet(): void {
    this.tweetService.likeTweet(this.tweet!.id)
      .pipe(tap((res) => {
        if (res.status == 201) {
          this.tweet!.likes_count++;
          this.tweet!.auth_likes = true;
        }
      }))
      .subscribe();
  }

  // TODO: It's the same in tweet-component. DRY!
  unlikeTweet(): void {
    this.tweetService.unlikeTweet(this.tweet!.id)
      .pipe(tap((res) => {
        if (res.status == 204) {
          this.tweet!.likes_count--;
          this.tweet!.auth_likes = false;
        }
      }))
      .subscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { TweetService } from "../tweet.service";
import { Tweet } from "../tweet";
import { concatMap, of } from "rxjs";
import { DomElementService } from "../dom-element.service";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  feed: Tweet[] | null = null

  constructor(private tweetService: TweetService, private domElementService: DomElementService) { }

  ngOnInit(): void {
    this.tweetService.getFeed().subscribe(feed => this.feed = feed);
    this.infiniteScroll();
  }

  infiniteScroll(): void {
    this.domElementService.scrolledToFeedEnd$.next(false);
    let feedComplete: boolean = false
    this.domElementService.scrolledToFeedEnd$
      .pipe(
        concatMap(scrolledToEnd =>
          scrolledToEnd && !feedComplete ?
            this.tweetService.getFeed(this.feed!.length) :
            of()
        ),
      )
      .subscribe(moreTweets => {
        if (moreTweets.length > 0) {
          for (const tweet of moreTweets) {
            this.feed!.push(tweet);
          }
        } else {
          feedComplete = true
        }
      });
  }

  appendTweet(tweet: Tweet | null): void {
    if (tweet) {
      this.feed!.unshift(tweet);
    }
  }

}

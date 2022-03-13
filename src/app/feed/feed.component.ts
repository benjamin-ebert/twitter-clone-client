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
  feedFiltered: Tweet[] | null = null

  constructor(private tweetService: TweetService, private domElementService: DomElementService) { }

  ngOnInit(): void {
    this.tweetService.getFeed().subscribe(feed => {
      this.feed = feed;
      this.filterFeed(feed);
    });
    this.infiniteScroll();
  }

  infiniteScroll(): void {
    this.domElementService.scrolledToFeedEnd$.next(false);
    let feedComplete: boolean = false
    this.domElementService.scrolledToFeedEnd$
      .pipe(
        concatMap(scrolledToEnd => scrolledToEnd && !feedComplete ?
          this.tweetService.getFeed(this.feed!.length) : of()
        ),
      )
      .subscribe(moreTweets => {
        if (moreTweets.length > 0) {
          for (const tweet of moreTweets) this.feed!.push(tweet);
          this.filterFeed(this.feed!);
        } else {
          feedComplete = true;
        }
      });
  }

  // filterFeed filters out any replies that have the same parent, keeping only
  // the most recent one. This prevents us from seeing multiple replies to the same
  // tweet, with the parent tweet showing up every time too. We only want to see
  // the latest reply, the parent, and an indication if there are more replies.
  filterFeed(feed: Tweet[]): void {
    this.feedFiltered = feed.filter((value, index, self) => {
      return self.findIndex(v => v.replies_to_id === value.replies_to_id) === index
        || !value.hasOwnProperty('replies_to_id');
    });
  }

  appendTweet(tweet: Tweet | null): void {
    if (tweet) {
      this.feed!.unshift(tweet);
    }
  }

}

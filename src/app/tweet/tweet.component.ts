import { Component, Input } from '@angular/core';
import { Tweet } from "../tweet";
import { TweetService } from "../tweet.service";
import { tap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { TweetDialogComponent } from "../tweet-dialog/tweet-dialog.component";

@Component({
  selector: 'app-tweet[tweet]',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  @Input() tweet!: Tweet

  constructor(private tweetService: TweetService, private dialog: MatDialog) { }

  openReplyDialog(): void {
    const dialogRef = this.dialog.open(TweetDialogComponent, {
      data: { repliesTo: this.tweet},
      autoFocus: false,
      position: { top: '5%' },
      width: '600px',
    })
    dialogRef.afterClosed().subscribe(tweet => {
      if (tweet) {
        this.tweet.replies_count++;
        this.tweet.auth_replied = true;
      }
    })
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

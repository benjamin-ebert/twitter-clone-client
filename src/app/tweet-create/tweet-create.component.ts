import { Component, Output, EventEmitter } from '@angular/core';
import {Tweet} from "../tweet";
import {FormBuilder, Validators} from "@angular/forms";
import {finalize, Observable, tap} from "rxjs";
import {User} from "../user";
import {select, Store} from "@ngrx/store";
import {selectUserInfo} from "../store";
import {TweetService} from "../tweet.service";

@Component({
  selector: 'app-tweet-create',
  templateUrl: './tweet-create.component.html',
  styleUrls: ['./tweet-create.component.scss']
})
export class TweetCreateComponent {

  user$: Observable<User|null> = this.store.pipe(select(selectUserInfo));
  tweetForm = this.formBuilder.group({
    content: ['', [Validators.max(280), Validators.required]],
  });
  loading: boolean = false;
  @Output() tweetCreated = new EventEmitter<Tweet>();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private tweetService: TweetService
    ) { }

  createTweet(tweet: Tweet) {
    this.loading = true
    this.tweetService.createTweet(tweet)
      .pipe(finalize(() => this.loading = false))
      .subscribe(tweet => this.tweetCreated.emit(tweet))
    // TODO: If on own profile, reload profile?
    // TODO: If on feed, reload feed?
  }

}

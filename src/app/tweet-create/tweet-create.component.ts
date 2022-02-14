import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Observable, concatMap, iif, of, catchError, throwError } from "rxjs";
import { User } from "../user";
import { Tweet } from "../tweet";
import { select, Store } from "@ngrx/store";
import { selectUserInfo } from "../store";
import { TweetService } from "../tweet.service";

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
  imagesPreview: string[] = []
  images: File[] = []
  loading: boolean = false;
  @Output() tweetCreated = new EventEmitter<Tweet>();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private tweetService: TweetService,
    ) { }

  // createTweet first makes an api call to store the tweet. If that's successful,
  // and if there are images to be uploaded, it makes a call to upload the images.
  createTweet(tweet: Tweet) {
    this.loading = true;
    this.tweetService.createTweet(tweet)
      .pipe(
        // After the save request has completed and returned the new tweet...
        concatMap(tweet => iif(
          // ...if there are images to upload...
          () => this.images.length > 0,
          // ...upload them and return the tweet along with its images...
          this.tweetService.uploadTweetImages(this.images, tweet.id),
          // ...otherwise, return the tweet from the original save request.
          of(tweet)
        )),
        // TODO: Proper error handling.
        catchError(err => throwError(err))
      )
      .subscribe(tweet => {
        console.log(tweet);
        this.loading = false;
        this.tweetCreated.emit(tweet);
        // TODO: If on own profile, reload profile?
        // TODO: If on feed, reload feed?
      });
  }

  imagesValid(images: FileList): boolean {
    // Check max number of images.
    if (images.length > 4) {
      // TODO: Display message here.
      console.log('not more than 4');
      return false;
    }
    for (let i = 0; i < images.length; i++) {
      // Check file type.
      if (images.item(i)!.type !== 'image/jpeg' && images.item(i)!.type !== 'image/png') {
        // TODO: Display message here.
        console.log('Only pngs or jpegs allowed')
        return false;
      }
      // Check max upload size.
      if (images.item(i)!.size > 5000000) {
        // TODO: Display message here.
        console.log('One is too big, max 5MB');
        return false;
      }
    }
    return true
  }

  makePreview(images: FileList): void {
    if (this.imagesValid(images)) {
      this.imagesPreview = [];
      for (let i = 0; i < images.length; i++) {
        let reader = new FileReader()
        reader.onloadend = () => {
          let url = reader.result
          if (typeof url === 'string') this.imagesPreview.push(url)
          // TODO: else?
        }
        reader.readAsDataURL(images.item(i)!) // null check here?
        this.images.push(images.item(i)!)
      }
    }
  }

  removeImage(index: number) {
    this.imagesPreview.splice(index, 1)
    this.images.splice(index, 1)
  }
}

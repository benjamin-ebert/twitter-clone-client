import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Observable, concatMap, iif, of, finalize } from "rxjs";
import { User } from "../user";
import { Tweet } from "../tweet";
import { select, Store } from "@ngrx/store";
import { selectUserInfo } from "../store";
import { TweetService } from "../tweet.service";
import { ErrorService } from "../error.service";

@Component({
  selector: 'app-tweet-create',
  templateUrl: './tweet-create.component.html',
  styleUrls: ['./tweet-create.component.scss']
})
export class TweetCreateComponent {
  @Input() repliesTo: Tweet | null = null;
  @Input() displayRepliesTo: boolean = false;

  authedUser$: Observable<User|null> = this.store.pipe(select(selectUserInfo));
  tweetForm = this.formBuilder.group({
    // content: ['', [Validators.max(280), Validators.required]],
    content: ['', [Validators.max(280)]],
  });
  imagesPreview: string[] = []
  images: File[] = []
  loading: boolean = false;
  @Output() tweetCreated = new EventEmitter<Tweet>();

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private tweetService: TweetService,
    private errorService: ErrorService
    ) { }

  // createTweet first makes an api call to store the tweet. If the tweet is
  // successfully created and returned, and if there are images to be uploaded,
  // it makes another api call to upload the images for that tweet.
  createTweet(tweet: Tweet) {
    this.loading = true;
    if (this.repliesTo) tweet.replies_to_id = this.repliesTo.id;
    this.tweetService.createTweet(tweet)
      .pipe(
        // When the createTweet observable completes with emitting the newly created tweet...
        concatMap(tweet => iif(
          // ...check if there are images to be uploaded for that tweet...
          () => this.images.length > 0,
          // ...if yes, upload them, appending the uploadTweetImages observable...
          this.tweetService.uploadTweetImages(this.images, tweet.id),
          // ...otherwise, return an observable with the tweet emitted by the createTweet observable.
          of(tweet)
        )),
        finalize(() => this.loading = false)
      )
      // This subscription now either holds a tweet with images, emitted by the uploadTweetImages
      // observable, or the originally created tweet without any images, which was first emitted
      // by the createTweet observable and then re-emitted by of(tweet). The tweet is emitted to
      // the parent, which on that event closes the tweet dialog.
      .subscribe(tweet => {
        this.tweetCreated.emit(tweet);
        // TODO: Append tweet?
        this.tweetForm.reset();
        this.images = [];
        this.imagesPreview = [];
      });
  }

  makePreview(images: FileList): void {
    if (this.imagesValid(images)) {
      this.imagesPreview = [];
      for (let i = 0; i < images.length; i++) {
        let reader = new FileReader()
        reader.onloadend = () => {
          let url = reader.result
          if (typeof url === 'string') {
            this.imagesPreview.push(url)
            this.images.push(images.item(i)!)
          } else {
            this.errorService.openSnackBar('There was a problem with an image.')
          }
        }
        reader.readAsDataURL(images.item(i)!)
      }
    }
  }

  imagesValid(images: FileList): boolean {
    // Check max number of images.
    if (images.length > 4) {
      // TODO: Better properly throw an error?
      this.errorService.openSnackBar('Please choose up to 4 photos.')
      return false;
    }
    for (let i = 0; i < images.length; i++) {
      // Check file type.
      if (images.item(i)!.type !== 'image/jpeg' && images.item(i)!.type !== 'image/png') {
        this.errorService.openSnackBar('Please use .png or .jpeg photos.')
        return false;
      }
      // Check max upload size.
      if (images.item(i)!.size > 2000000) {
        this.errorService.openSnackBar('Please choose photos smaller than 5MB.')
        return false;
      }
    }
    return true
  }

  removeImage(index: number) {
    this.imagesPreview.splice(index, 1)
    this.images.splice(index, 1)
  }
}

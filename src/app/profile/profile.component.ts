import { Component } from '@angular/core';
import { finalize, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { User } from "../user";
import { ProfileService } from "../profile.service";
import { Tweet } from "../tweet";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  userId: number = Number(this.route.snapshot.paramMap.get('userId'));
  profile$: Observable<User> = this.profileService.getProfile(this.userId);
  allTweets: Tweet[] = [];
  allTweetsLoaded: boolean = false;
  imageTweets: Tweet[] = [];
  imageTweetsLoaded: boolean = false;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    ) { }

  tabChange(tabIndex: number) {
    if (tabIndex === 1 && !this.allTweetsLoaded) {
      this.getAllTweetsOfUser()
    }
    if (tabIndex === 2 && !this.imageTweetsLoaded) {
      this.getImageTweetsOfUser()
    }
  }

  getAllTweetsOfUser(): void {
    this.profileService.getAllTweetsOfUser(this.userId)
      .pipe(finalize(() => {
        this.allTweetsLoaded = true;
        this.imageTweets = this.allTweets.filter(tweet => tweet.images.length > 0)
        this.imageTweetsLoaded = true;
      }))
      .subscribe(tweets => this.allTweets = tweets);
  }

  getImageTweetsOfUser(): void {
    this.profileService.getImageTweetsOfUser(this.userId)
      .pipe(finalize(() => this.imageTweetsLoaded = true))
      .subscribe(tweets => this.imageTweets = tweets);
  }
}

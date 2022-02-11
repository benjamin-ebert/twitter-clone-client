import { Component, OnInit } from '@angular/core';
import { finalize } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../user";
import { ProfileService } from "../profile.service";
import { Tweet } from "../tweet";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userId: number = Number(this.route.snapshot.paramMap.get('userId'));
  profile: User | null = null
  allTweets: Tweet[] = [];
  allTweetsLoaded: boolean = false;
  imageTweets: Tweet[] = [];
  imageTweetsLoaded: boolean = false;
  likedTweets: Tweet[] = [];
  likedTweetsLoaded: boolean = false;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.getProfile()
  }

  tabChange(tabIndex: number) {
    if (tabIndex === 1 && !this.allTweetsLoaded) {
      this.getAllTweetsOfUser()
    }
    if (tabIndex === 2 && !this.imageTweetsLoaded) {
      this.getImageTweetsOfUser()
    }
    if (tabIndex === 3 && !this.likedTweetsLoaded) {
      this.getLikedTweetsOfUser()
    }
  }

  getProfile(): void {
    this.profileService.getProfile(this.userId)
      .subscribe(profile => this.profile = profile)
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

  getLikedTweetsOfUser(): void {
    this.profileService.getLikedTweetsOfUser(this.userId)
      .pipe(finalize(() => this.likedTweetsLoaded = true))
      .subscribe(tweets => this.likedTweets = tweets)
  }
}

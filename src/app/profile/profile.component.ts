import { Component, OnInit } from '@angular/core';
import {Observable, tap, finalize, concatMap} from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../user";
import { ProfileService } from "../profile.service";
import { Tweet } from "../tweet";
import { ProfileDialogComponent } from "../profile-dialog/profile-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { selectUserInfo } from "../store";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  authedUser$: Observable<User|null> = this.store.pipe(select(selectUserInfo));
  profile$: Observable<User> = this.profileService.profileState$;
  userId: number = Number(this.route.snapshot.paramMap.get('userId'));
  allTweets: Tweet[] = [];
  allTweetsLoaded: boolean = false;
  imageTweets: Tweet[] = [];
  imageTweetsLoaded: boolean = false;
  likedTweets: Tweet[] = [];
  likedTweetsLoaded: boolean = false;

  constructor(
    private profileService: ProfileService,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    // TODO: This is just here to emit the new profile into profileState, which profile$ subscribes to.
    // TODO: Might as well just "dispatch" a new "profileChanged" here? Would be more readable.
    this.profileService.getProfile(this.userId).subscribe()
  }

  openProfileDialog(): void {
    this.dialog.open(ProfileDialogComponent, {
      autoFocus: false,
      position: { top: '5%' },
      width: '600px',
      maxHeight: '90vh'
    });
  }

  followUser(): void {
    this.profileService.followUser(this.userId)
      // TODO: Do something better than reloading the entire profile? State?
      .pipe(concatMap(() => this.profileService.getProfile(this.userId)))
      .subscribe();
  }

  unfollowUser(): void {
    this.profileService.unfollowUser(this.userId)
      // TODO: Do something better than reloading the entire profile? State?
      .pipe(concatMap(() => this.profileService.getProfile(this.userId)))
      .subscribe();
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

import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { Observable, Subject, concatMap, tap, of, first } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { selectUserInfo } from "../store";
import { User } from "../user";
import { ProfileService } from "../profile.service";
import { FollowService } from "../follow.service";
import { DomElementService } from "../dom-element.service";
import { Tweet } from "../tweet";
import { ProfileDialogComponent } from "../profile-dialog/profile-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('tabs') tabGroup!: MatTabGroup;

  userId: number = Number(this.route.snapshot.paramMap.get('userId'));
  authedUser$: Observable<User|null> = this.store.pipe(select(selectUserInfo));
  profile$: Subject<User> = this.profileService.profileState$;
  selectedTab$ = new Subject<number>();
  tabContentComplete: boolean = false;
  originalTweets: Tweet[] = [];
  allTweets: Tweet[] = [];
  imageTweets: Tweet[] = [];
  likedTweets: Tweet[] = [];

  constructor(
    private profileService: ProfileService,
    private followService: FollowService,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private domElementService: DomElementService,
    ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    // Get the profile. The resulting user data is emitted into this.profile$.
    // TODO: Make sure first() doesn't break shit.
    this.profileService.getProfile(this.userId).pipe(first()).subscribe()
  }

  ngAfterViewInit() {
    // When this.profile$ changes, e.g. when the user updates their name / avatar / etc.,
    // reload the currently selected tab, so the changes are visible in their tweets instantly.
    this.profile$.subscribe(() => this.selectedTab$.next(this.tabGroup.selectedIndex!))

    // When they select another tab, flush and reload the content of that tab. Okay to do,
    // because tabs only load the 10 latest tweets initially, the rest being loaded as they scroll.
    this.selectedTab$
      .pipe(
        tap((index) => this.flushTabContent(index)),
        tap(() => this.tabContentComplete = false),
        concatMap((index) => this.loadTabContent(index)),
      )
      .subscribe(tweets => this.appendTabContent(this.tabGroup.selectedIndex!, tweets))

    // Set up infinite scroll / tweet load on scroll functionality.
    this.infiniteScroll();
  }

  infiniteScroll(): void {
    // Reset the value of scrolledTProfileEnd$ to false.
    this.domElementService.scrolledToProfileEnd$.next(false);
    // The value will get set to true, if they reach the bottom. Subscribe to get that.
    this.domElementService.scrolledToProfileEnd$
      .pipe(
        concatMap(scrolledToEnd =>
          // If we scrolled to the end, and we don't have all tweets of that tab yet...
          scrolledToEnd && !this.tabContentComplete ?
            // ...request 10 more tweets for that tab.
            this.loadTabContent(this.tabGroup.selectedIndex!) :
            of()
        ),
      )
      .subscribe(moreTweets => {
        // If we actually got any new tweets from the request...
        if (moreTweets.length > 0) {
          // ...push those to the bottom of the tab we're in...
          this.appendTabContent(this.tabGroup.selectedIndex!, moreTweets)
        } else {
          // ...otherwise, assume that we have all tweets for that tab, and prevent further requests.
          this.tabContentComplete = true;
        }
      });
  }

  // loadTabContent takes the index of the currently selected tab and requests the
  // tweets that should show in that tab.
  loadTabContent(index: number): Observable<Tweet[]> {
    switch (index) {
      case 0: return this.getOriginalTweets();
      case 1: return this.getAllTweets();
      case 2: return this.getImageTweets();
      case 3: return this.getLikedTweets();
      default: return of();
    }

  }

  // appendTabContent takes the index of the currently selected tab and an array of tweets,
  // and pushes those tweet to the end of the tab. If the tab is "Tweets & Replies", it
  // filters potential "duplicates", see more below.
  appendTabContent(index: number, tweets: Tweet[]): void {
    for (const tweet of tweets) {
      switch (index) {
        case 0: this.originalTweets.push(tweet); break;
        case 1: this.allTweets.push(tweet);break;
        case 2: this.imageTweets.push(tweet); break;
        case 3: this.likedTweets.push(tweet); break;
      }
    }
    // If we are in tab "Tweets & Replies", filter out any replies that have the same
    // parent, and only keep the most recent one. This prevents us from seeing multiple
    // replies to the same tweet, with the parent tweet showing up every time too.
    // We only want to see the latest reply, the parent, and an indication that there
    // are more replies, if that's the case.
    if (index === 1) {
      this.allTweets.filter((value, index, self) => {
        return self.findIndex(v => v.replies_to_id === value.replies_to_id) === index
          || !value.hasOwnProperty('replies_to_id');
      })
    }
  }

  // flushTabContent removes all tweets in the tab with the given index.
  // Only called directly before reloading the content for that tab.
  flushTabContent(index: number): void {
    switch (index) {
      case 0:this.originalTweets = []; break;
      case 1:this.allTweets = []; break;
      case 2:this.imageTweets = []; break;
      case 3:this.likedTweets = []; break;
    }
  }

  openProfileDialog(): void {
    this.dialog.open(ProfileDialogComponent, {
      autoFocus: false,
      position: { top: '5%' },
      width: '600px',
      maxHeight: '90vh'
    });
  }

  followUser(user: User): void {
    this.followService.follow(user);
  }

  unfollowUser(user: User): void {
    this.followService.unfollow(user)
  }

  getOriginalTweets(): Observable<Tweet[]> {
    return this.profileService.getOriginalTweets(this.userId, this.originalTweets.length)
  }

  getAllTweets(): Observable<Tweet[]> {
    return this.profileService.getAllTweets(this.userId, this.allTweets.length)
  }

  getImageTweets(): Observable<Tweet[]> {
    return this.profileService.getImageTweets(this.userId, this.imageTweets.length)
  }

  getLikedTweets(): Observable<Tweet[]> {
    return this.profileService.getLikedTweets(this.userId, this.likedTweets.length)
  }
}

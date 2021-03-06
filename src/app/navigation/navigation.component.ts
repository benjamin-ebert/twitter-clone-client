import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { select, Store } from "@ngrx/store";
import { logout, selectUserInfo } from "../store";
import { MatDialog } from "@angular/material/dialog";
import { TweetDialogComponent } from "../tweet-dialog/tweet-dialog.component";
import { User } from "../user";
import { ProfileService } from "../profile.service";
import { DomElementService } from "../dom-element.service";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  env = environment;
  authedUser$: Observable<User|null> = this.store.pipe(select(selectUserInfo));
  viewingProfile$: Subject<User> = this.profileService.profileState$;

  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 1024px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public trends: Array<any> = [
    { 'tag': 'Trending in your region', 'title': '#Food', 'tweets': 4552 },
    { 'tag': 'You may like', 'title': '#Tech', 'tweets': 7849 },
    { 'tag': 'Discover', 'title': '#Health', 'tweets': 6927 },
    { 'tag': 'Trending in your city', 'title': '#Business', 'tweets': 8122 },
    { 'tag': 'Your followers like', 'title': '#Politics', 'tweets': 5791 },
  ]

  constructor(
    private breakpointObserver: BreakpointObserver,
    private domElementService: DomElementService,
    public profileService: ProfileService,
    private store: Store,
    public router: Router,
    public location: Location,
    public dialog: MatDialog,
  ) {}

  onScroll(event: any) {
    if (this.router.url.startsWith('/feed')) {
      // visible height + pixel scrolled >= total height
      if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight -20) {
        this.domElementService.scrolledToFeedEnd$.next(true);
      }
    }
    if (this.router.url.startsWith('/profile')) {
      if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 20) {
        this.domElementService.scrolledToProfileEnd$.next(true);
      }
    }
  }

  openTweetDialog(): void {
    this.dialog.open(TweetDialogComponent, {
      autoFocus: false,
      position: { top: '5%' },
      width: '600px',
    });
  }

  logout(): void {
    this.store.dispatch(logout());
  }

  back(): void {
    this.location.back();
  }
}

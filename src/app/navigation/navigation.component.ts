import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import {Observable, tap} from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { select, Store } from "@ngrx/store";
import { logout, selectUserInfo } from "../store";
import { MatDialog } from "@angular/material/dialog";
import { TweetDialogComponent } from "../tweet-dialog/tweet-dialog.component";
import { User } from "../user";
import { ProfileService } from "../profile.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  user$: Observable<User|null> = this.store.pipe(select(selectUserInfo));
  viewingProfile$: Observable<User> = this.profileService.profileState$;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public trends: Array<any> = [
    { 'tag': 'Trending in your region', 'title': '#MedTech', 'tweets': 7552 },
    { 'tag': 'Trending in your region', 'title': '#MedTech', 'tweets': 7552 },
    { 'tag': 'Trending in your region', 'title': '#MedTech', 'tweets': 7552 },
    { 'tag': 'Trending in your region', 'title': '#MedTech', 'tweets': 7552 },
    { 'tag': 'Trending in your region', 'title': '#MedTech', 'tweets': 7552 },
  ]
  public candidates: Array<any> = [
    { 'name': 'LucaG', 'handle': '@luca_cloud' },
    { 'name': 'Go News', 'handle': '@golang_news' },
    { 'name': 'Golang Go', 'handle': '@GolangGo' },
  ]

  value = 'Clear me';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store,
    public router: Router,
    public location: Location,
    public profileService: ProfileService,
    public dialog: MatDialog,
  ) {}

  openDialog(): void {
    this.dialog.open(TweetDialogComponent, {
      autoFocus: false,
      position: { top: '5%' },
      maxWidth: '80vw',
      maxHeight: '90vh',
      minWidth: '600px',
    });
  }

  logout(): void {
    this.store.dispatch(logout());
  }

  back(): void {
    this.location.back();
  }

  counter(i: number) {
    return new Array(i);
  }
}

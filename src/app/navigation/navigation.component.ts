import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from "@ngrx/store";
import { logout } from "../store";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  isTablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Tablet)
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

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
    public location: Location
  ) {}

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

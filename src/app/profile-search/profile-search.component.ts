import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  Observable,
  Subject,
  of,
  switchMap,
  catchError,
  throwError,
  debounceTime,
  distinctUntilChanged,
} from "rxjs";
import { User } from "../user";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.scss']
})
export class ProfileSearchComponent implements OnInit {
  env = environment;
  @ViewChild('searchBox') searchBox!: ElementRef<HTMLInputElement>;
  private searchProfilesUrl = 'api/search/profiles';
  private searchTerms = new Subject<string>();
  searchResults$!: Observable<User[]>;

  constructor(public http: HttpClient, public router: Router,) { }

  ngOnInit() {
    this.searchResults$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchProfiles(term))
    );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // TODO: Put this into profiles-service
  searchProfiles(term: string): Observable<User[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<User[]>(this.searchProfilesUrl + '/' + term)
      .pipe(catchError(err => throwError(err)));
  }

  onEnter(event: any) {
    this.router.navigate(['profile/' + event.source.value]).then(() => {
      this.searchBox.nativeElement.value = ''
    })
  }
}

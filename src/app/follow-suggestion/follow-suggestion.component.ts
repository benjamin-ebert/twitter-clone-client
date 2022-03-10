import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { User } from "../user";
import { FollowService } from "../follow.service";
import {Tweet} from "../tweet";

@Component({
  selector: 'app-follow-suggestion',
  templateUrl: './follow-suggestion.component.html',
  styleUrls: ['./follow-suggestion.component.scss']
})
export class FollowSuggestionComponent implements OnInit {
  @Input() user!: User;
  private getSuggestionsUrl = 'api/follow/suggestions';
  suggestions: User[]|null = null
  showAll: boolean = false;

  constructor(private http: HttpClient, private followService: FollowService) { }

  ngOnInit(): void {
    this.getSuggestions().subscribe(suggestions => this.suggestions = suggestions);
  }

  getSuggestions(): Observable<User[]> {
    return this.http.get<User[]>(this.getSuggestionsUrl + '/' + this.user.id)
      .pipe(catchError(err => throwError(err)));
  }

  followUser(user: User): void {
    this.followService.follow(user);
  }

  unfollowUser(user: User): void {
    this.followService.unfollow(user)
  }
}

import { Component } from '@angular/core';
import {finalize, Observable} from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { User } from "../user";
import { ProfileService } from "../profile.service";
import {Tweet} from "../tweet";

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

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    ) { }

  tabChange(tabIndex: number) {
    if (tabIndex === 1 && !this.allTweetsLoaded) {
      this.getAllTweetsOfUser()
    }
  }

  getAllTweetsOfUser(): void {
    this.profileService.getAllTweetsOfUser(this.userId)
      .pipe(finalize(() => this.allTweetsLoaded = true))
      .subscribe(tweets => this.allTweets = tweets);
  }
}

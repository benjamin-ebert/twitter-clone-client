import { Component } from '@angular/core';
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { User } from "../user";
import { ProfileService } from "../profile.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  id: number = Number(this.route.snapshot.paramMap.get('userId'));
  profile$: Observable<User> = this.profileService.getProfile(this.id);

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    ) { }

}

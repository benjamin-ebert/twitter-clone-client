import { Injectable } from '@angular/core';
import {Observable, Subject, tap} from "rxjs";
import { User } from "./user";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  private profileUrl = 'api/profile';
  private latestProfile = new Subject<any>();
  profileState$ = this.latestProfile.asObservable();

  emitProfileChange(profile: User): void {
    this.latestProfile.next(profile)
  }

  getProfile(id: number): Observable<User> {
    return this.http.get<User>(this.profileUrl + '/' + id)
      .pipe(tap((profile) => this.emitProfileChange(profile)))
  }

}

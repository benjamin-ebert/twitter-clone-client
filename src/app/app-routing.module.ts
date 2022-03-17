import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from "./navigation/navigation.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./auth.guard";
import { FeedComponent } from "./feed/feed.component";
import { ProfileComponent } from "./profile/profile.component";
import { TweetDetailComponent } from "./tweet-detail/tweet-detail.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'feed', component: FeedComponent },
      { path: 'profile/:userId', component: ProfileComponent },
      { path: 'tweet/:tweetId', component: TweetDetailComponent },
      { path: '**', redirectTo: 'feed', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

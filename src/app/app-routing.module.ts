import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NavigationComponent} from "./navigation/navigation.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {FeedComponent} from "./feed/feed.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'feed', component: FeedComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

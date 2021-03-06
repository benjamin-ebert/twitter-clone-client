import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ClipboardModule } from "@angular/cdk/clipboard";

import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { CsrfInterceptor } from "./interceptors/csrf.interceptor";
import { ApiInterceptor } from "./api.interceptor";
import { AuthService } from "./auth.service";
import { appReducer, appEffects } from "./store";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { FeedComponent } from './feed/feed.component';
import { ProfileComponent } from './profile/profile.component';
import { TweetComponent } from './tweet/tweet.component';
import { TweetDialogComponent } from './tweet-dialog/tweet-dialog.component';
import { TweetCreateComponent } from './tweet-create/tweet-create.component';
import { GlobalErrorHandler } from "./global-error-handler";
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { TweetDetailComponent } from './tweet-detail/tweet-detail.component';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { FollowSuggestionComponent } from './follow-suggestion/follow-suggestion.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    FeedComponent,
    ProfileComponent,
    TweetComponent,
    TweetDialogComponent,
    TweetCreateComponent,
    ProfileDialogComponent,
    TweetDetailComponent,
    ProfileSearchComponent,
    FollowSuggestionComponent,
    LoginDialogComponent,
    RegisterDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot(appEffects),

    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTooltipModule,
    MatAutocompleteModule,
    ClipboardModule,

    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [
    [
      AuthService,
      { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
      { provide: ErrorHandler, useClass: GlobalErrorHandler }
    ],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

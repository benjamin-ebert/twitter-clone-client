import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from "rxjs";
import * as authActions from "./auth.actions";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { AuthService } from "../../auth.service";
import { User } from "../../user";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) { }

  // Call authService's login method. When done,
  // fire checkAuth to see if we are logged in now.
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login.type),
      switchMap((user: User) => this.authService.login(user).pipe(
        map(() => authActions.checkAuth())
      ))
    ),
  );

  // Call the authService's isLoggedIn method.
  // When done, pass the resulting bool to checkAuthComplete.
  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.checkAuth),
      switchMap(() => this.authService.isLoggedIn()
        .pipe(
          map((isLoggedIn) =>
            authActions.checkAuthComplete({ isLoggedIn }))
        ))
    )
  )

  // Expects a bool indicating if we are logged in or not.
  // If true, fire loginComplete (and redirect to /home if appropriate),
  // otherwise fire logoutComplete (which will redirect to /login).
  checkAuthComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.checkAuthComplete),
      switchMap(({ isLoggedIn }) => {
        if (isLoggedIn) {
          return this.authService.userInfo().pipe(
            map((user) => authActions.loginComplete({ user, isLoggedIn })),
            tap(() => {
                if (this.router.url === '/login') this.router.navigate(['/home']);
            })
          )
        }
        return of(authActions.logoutComplete());
      })
    )
  )

  // Call the authService's logout method. When done,
  // fire checkAuth to see if we are really logged out now.
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logout),
      switchMap(() => this.authService.logout().pipe(
        map(() => authActions.checkAuth())
      ))
    )
  );

  // Redirect to the login page.
  logoutComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logoutComplete),
      tap(() => {
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  )
}

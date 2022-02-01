import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { User } from "../user";
import { select, Store } from "@ngrx/store";
import { login, logout, selectIsAuthenticated } from "../store";
import { Observable } from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Boolean value indicating if the user is logged in or not.
  // Value comes from the auth store and gets assigned in ngOnInit().
  isAuthenticated$: Observable<boolean> = new Observable<boolean>();

  // Form to input email and password to login with an existing account.
  loginForm = this.formBuilder.group({
    email: ['cherz@example.com', Validators.email],
    password: ['password']
  })

  // registerForm = this.formBuilder.group({
  //   name: ['', Validators.required],
  //   email: ['', Validators.email],
  //   password: ['']
  // })

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private store: Store<any>
  ) { }

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }

  /**
   * Trim the values a user has put into the loginForm, return if empty.
   * Otherwise, dispatch the login action in the auth store.
   * @param user
   */
  login(user: User): void {
    user.email = user.email.trim();
    user.password = user.password.trim();
    if (!user.email || !user.password) { return; }
    this.store.dispatch(login(user));
  }

  /**
   * Dispatch the logout action in the auth store.
   */
  logout(): void {
    this.store.dispatch(logout());
  }

  /**
   * Call the authService to try to get the user's profile.
   */
  profile(): void {
    this.authService.profile().subscribe()
  }
}

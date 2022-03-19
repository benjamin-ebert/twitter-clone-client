import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Store } from "@ngrx/store";
import { User } from "../user";
import { login } from "../store";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

  signingIn$ = this.authService.signingIn$;
  callingGithub: boolean = false;

  loginForm = this.formBuilder.group({
    email: ['herz@example.com', Validators.email],
    password: ['password']
  })

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private store: Store<any>,
    private dialogRef: MatDialogRef<LoginDialogComponent>
  ) { }

  /**
   * Trim the values a user has put into the loginForm, return if empty.
   * Otherwise, dispatch the login action in the auth store.
   * @param user
   */
  login(user: User): void {
    user.email = user.email.trim();
    user.password = user.password.trim();
    if (!user.email || !user.password) return
    this.store.dispatch(login(user));
  }

  close(): void {
    this.dialogRef.close();
  }

  oauthGithubLogin(): void {
    this.callingGithub = true;
    this.authService.oauthGithubLogin();
  }
}

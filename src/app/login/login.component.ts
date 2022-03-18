import { Component, OnDestroy } from '@angular/core';
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { LoginDialogComponent } from "../login-dialog/login-dialog.component";
import { RegisterDialogComponent } from "../register-dialog/register-dialog.component";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  callingGithub: boolean = false;

  constructor(
    private store: Store<any>,
    private dialog: MatDialog,
    private authService: AuthService,
  ) { }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      autoFocus: false,
      width: '600px',
    });
  }

  openRegisterDialog(): void {
    this.dialog.open(RegisterDialogComponent, {
      autoFocus: false,
      width: '600px',
    });
  }

  oauthGithubLogin(): void {
    this.callingGithub = true;
    this.authService.oauthGithubLogin();
  }
}

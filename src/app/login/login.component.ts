import { Component, OnDestroy } from '@angular/core';
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { LoginDialogComponent } from "../login-dialog/login-dialog.component";
import { RegisterDialogComponent } from "../register-dialog/register-dialog.component";

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
  ) { }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      autoFocus: false,
      // position: { top: '5%' },
      width: '600px',
    });
  }

  openRegisterDialog(): void {
    this.dialog.open(RegisterDialogComponent, {
      autoFocus: false,
      // position: { top: '5%' },
      width: '600px',
    });
  }

}

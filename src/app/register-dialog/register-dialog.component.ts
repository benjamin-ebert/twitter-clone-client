import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Store } from "@ngrx/store";
import { MatDialogRef } from "@angular/material/dialog";
import { User } from "../user";
import { register } from "../store";

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent {

  signingUp: boolean = false;

  registerForm = this.formBuilder.group({
    name: [''],
    handle: [''],
    email: ['', Validators.email],
    password: ['']
  })

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private store: Store<any>,
    private dialogRef: MatDialogRef<RegisterDialogComponent>
  ) { }

  /**
   * Trim the values a user has put into the loginForm, return if empty.
   * Otherwise, dispatch the login action in the auth store.
   * @param user
   */
  register(user: User): void {
    user.name = user.name.trim();
    user.handle = user.handle.trim();
    user.email = user.email.trim();
    user.password = user.password.trim();
    if (!user.name || !user.handle || !user.email || !user.password) return
    this.store.dispatch(register(user));
  }

  close(): void {
    this.dialogRef.close();
  }
}

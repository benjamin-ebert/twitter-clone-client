import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { User } from "../user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    email: ['cherz@example.com', Validators.email],
    password: ['password']
  })

  registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.email],
    password: ['']
  })

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {

  }

  login(user: User): void {
    user.email = user.email.trim();
    user.password = user.password.trim();
    if (!user.email || !user.password) { return; }
    this.authService.login(user).subscribe();
      // .subscribe(user => console.log(user))
  }
}

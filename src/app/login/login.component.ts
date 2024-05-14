import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {UserService} from "../services/user/user.service";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInputModule, MatButton, MatIcon, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  passwordVisible = false;
  error = false;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup<any>({
      username: new FormControl('testUser', Validators.required),
      password: new FormControl('password', Validators.required)
    })
  }

  login() {
    if (this.formGroup.invalid) {
      return;
    }

    this.error = false;
    const value = this.formGroup.value;
    if (this.userService.username === value.username  || this.userService.password === value.password) {
      this.userService.authenticated = true;
      this.router.navigateByUrl('/users');
    } else {
      this.error = true;
    }
  }
}

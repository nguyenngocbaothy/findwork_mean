import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SigninSignupService } from '../service/signin-signup.service';
import { Store } from '@ngrx/store';
import { User } from '../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  href = false;
  url: string;

  formLogin: FormGroup;
  formSignup: FormGroup;
  userInfo: User;
  isSuccessLogin: any = 0;
  isSuccessSignUp: any = 0;

  constructor(
    private fb: FormBuilder,
    private user: SigninSignupService,
    private store: Store<any>,
    private route: Router
  ) {
    this.url = window.location.href;
    if (this.url.includes('employers')) {
      this.href = true;
    }
    this.user.isSuccess.subscribe(isLogin => {
      this.isSuccessLogin = isLogin;
      console.log(this.isSuccessLogin);
    });
  }

  ngOnInit() {
    this.formLogin = this.fb.group({
      userLoginEmail: ['', Validators.compose([Validators.email, Validators.required])],
      userLoginPassword : ['', Validators.required]
    });

    this.formSignup = this.fb.group({
      userSignupName: ['', Validators.required],
      userSignupEmail: ['', Validators.compose([Validators.email, Validators.required])],
      userSignupPassword : ['', Validators.required]
    });
  }

  click(value: Boolean) {
    if (value === true) {
      this.href = true;
    } else {
      this.href = false;
    }
  }

  get shouldShowEmailUserWarming() {
    const emailControl = this.formLogin.get('userLoginEmail');
    return emailControl.invalid && emailControl.touched;
  }

  get shouldShowPasswordUserWarming() {
    const passwordControl = this.formLogin.get('userLoginPassword');
    return passwordControl.invalid && passwordControl.touched;
  }

  login() {
    if (this.formLogin.value.userLoginEmail === '' || this.formLogin.value.userLoginPassword === '') {
      return;
    }
    this.user.loginUser(this.formLogin.value.userLoginEmail.toLowerCase().trim(), this.formLogin.value.userLoginPassword.trim());
    this.store.select('user').subscribe(userInfo => {
      if (!userInfo.success) {
        this.user.isSuccess.subscribe(isLogin => {
            this.isSuccessLogin = isLogin;
        });
      }
      if (userInfo.success) {
        this.userInfo = userInfo;
        localStorage.setItem('token', this.userInfo.user.token);
        this.user.isSuccess.subscribe(isLogin => {
          this.isSuccessLogin = isLogin;
      });
      }

    });
  }

  logout() {
    localStorage.removeItem('token');
    this.user.setSuccess(false);
    this.route.navigate(['home']);
    this.user.setSuccess(0);
    window.location.reload();
  }

  signUp() {
    console.log(this.formSignup.value.userSignupName, this.formSignup.value.userSignupEmail, this.formSignup.value.userSignupPassword);
    this.user.signUp(this.formSignup.value.userSignupName, this.formSignup.value.userSignupEmail, this.formSignup.value.userSignupPassword);
    this.store.select('user').subscribe(data => {
      console.log(data);
      if (data.success) {
        this.isSuccessSignUp = true;
      }
      if (!data.success) {
        this.isSuccessSignUp = false;
      }
    });
  }

  get shouldShowEmailUserSignUpWarming() {
    const eControl = this.formSignup.get('userSignupEmail');
    return eControl.invalid && eControl.touched;
  }

  get shouldShowNameUserSignUpWarming() {
    const nControl = this.formSignup.get('userSignupName');
    return nControl.invalid && nControl.touched;
  }

  get shouldShowPasswordUserSignUpWarming() {
    const pControl = this.formSignup.get('userSignupPassword');
    return pControl.invalid && pControl.touched;
  }

}

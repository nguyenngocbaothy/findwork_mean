import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SigninSignupService } from '../service/signin-signup.service';
import { JobsService } from '../service/jobs.service';
import { Store } from '@ngrx/store';
import { Employer } from '../types';
import { Router } from '@angular/router';
import { MESSAGES } from '../messages';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.css']
})
export class EmployersComponent implements OnInit {
  // Message employer not sign up
  EMPLOYER_NOT_SIGNUP = `${MESSAGES.EMPLOYERSIGNUP.EMPLOYERNOTSIGNUP}`;
  // Message employer sign up success
  EMPLOYER_SIGNUP_SUCCESS = `${MESSAGES.EMPLOYERSIGNUP.EMPLOYERSIGNUPSUCCESS}`;
  // Message employer sign up error
  EMPLOYER_SIGNUP_ERROR = `${MESSAGES.EMPLOYERSIGNUP.EMPLOYERSIGNUPERROR}`;

  // Message validate name
  VALIDATE_NAME = `${MESSAGES.VALIDATE.NAME}`;
  // Message validate email
  VALIDATE_EMAIL = `${MESSAGES.VALIDATE.EMAIL}`;
  // Message validate password
  VALIDATE_PASSWORD = `${MESSAGES.VALIDATE.PASSWORD}`;

  // Message employer not sign in
  EMPLOYER_NOT_SIGNIN = `${MESSAGES.EMPLOYERSIGIN.EMPLOYERNOTSIGNIN}`;
  // Message employer sign in success
  EMPLOYER_SIGNIN_SUCCESS = `${MESSAGES.EMPLOYERSIGIN.EMPLOYERSIGNINSUCCESS}`;
  // Message employer sign in error
  EMPLOYER_SIGNIN_ERROR = `${MESSAGES.EMPLOYERSIGIN.EMPLOYERSIGNINERROR}`;


  // FormGroup
  formSignupEmployer: FormGroup;
  formSigninEmployer: FormGroup;

  // Variable type is Employer that contain value of Employer type
  employer: Employer;

  /*
    Check user has signup
    0: user not signup
    true: user signup
    false: user not signup
  */
  isSuccessSignup: any = 0;

  /*
    Check user has login
    0: user not login
    true: user logined
    false: user not logined
  */
  isSuccessSignin: any = 0;


  // Inject service
  constructor(
    private fb: FormBuilder,
    private employerService: SigninSignupService,
    private store: Store<any>,
    private route: Router,
    private jobsService: JobsService
  ) {
    // Check user is login by check token is has
    if (localStorage.getItem('token')) {
      this.isSuccessSignin = true;
      this.employerService.setSuccess(true);
    }
   }

  // Initialize  value for validate form login and register when component fist displays
  ngOnInit() {
    this.formSignupEmployer = this.fb.group({
      employerSignupName: ['', Validators.required],
      employerSignupEmail: ['', Validators.compose([Validators.email, Validators.required])],
      employerSignupPassword: ['', Validators.required]
    });

    this.formSigninEmployer = this.fb.group({
      employerSigninEmail: ['', Validators.compose([Validators.email, Validators.required])],
      employerSigninPassword: ['', Validators.required]
    });
  }

  // Submit info user to register
  employerSignup() {
    this.employerService.signupEmployer(
      this.formSignupEmployer.value.employerSignupName,
      this.formSignupEmployer.value.employerSignupEmail,
      this.formSignupEmployer.value.employerSignupPassword
    );
    this.store.select('user').subscribe(data => {
      console.log(this.employer);
      if (this.employer.success) {
        this.isSuccessSignup = true;
      }
      if (!this.employer.success) {
        this.isSuccessSignup = false;
      }
    });
  }

  // check validate if error about email when register
  get shouldShowEmailEmployerSignUpWarming() {
    const eControl = this.formSignupEmployer.get('employerSignupEmail');
    return eControl.invalid && eControl.touched;
  }

  // check validate if error about name when register
  get shouldShowNameEmployerSignUpWarming() {
    const nControl = this.formSignupEmployer.get('employerSignupName');
    return nControl.invalid && nControl.touched;
  }

  // check validate if error about password when register
  get shouldShowPasswordEmployerSignUpWarming() {
    const pControl = this.formSignupEmployer.get('employerSignupPassword');
    return pControl.invalid && pControl.touched;
  }

  // Submit info user to login
  employerSignin() {
    const role = { role: 'E' };
    this.employerService.signinEmployer(
      this.formSigninEmployer.value.employerSigninEmail,
      this.formSigninEmployer.value.employerSigninPassword
    );
    this.store.select('user').subscribe(data => {
      this.employer = data;
      console.log(this.employer);
      if (this.employer.success) {
        this.isSuccessSignin = true;
        localStorage.setItem('token', this.employer.employer.token.toString());
        this.jobsService.idEmployer = this.employer.employer._id;
      }
      if (!this.employer.success) {
        this.isSuccessSignin = false;
      }

    });
  }

  // Check validate if error about email when login
  get shouldShowEmailEmployerSignInWarming() {
    const eControl = this.formSigninEmployer.get('employerSigninEmail');
    return eControl.invalid && eControl.touched;
  }

  // Check validate if error about password when login
  get shouldShowPasswordEmployerSignInWarming() {
    const pControl = this.formSigninEmployer.get('employerSigninPassword');
    return pControl.invalid && pControl.touched;
  }

  // Navigate to route admin of Employer
  postJob() {
    this.route.navigate(['/postjob']);
  }

}

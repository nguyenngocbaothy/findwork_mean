import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SigninSignupService } from '../service/signin-signup.service';
import { Store } from '@ngrx/store';
import { Employer } from '../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.css']
})
export class EmployersComponent implements OnInit {

  formSignupEmployer: FormGroup;
  formSigninEmployer: FormGroup;

  employer: Employer;
  isSuccessSignup: any = 0;
  isSuccessSignin: any = 0;


  constructor(
    private fb: FormBuilder,
    private employerService: SigninSignupService,
    private store: Store<any>,
    private route: Router
  ) {
    if (localStorage.getItem('token')) {
      this.isSuccessSignin = true;
      this.employerService.setSuccess(true);
    }
   }

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

  Employersignup() {
    this.employerService.SignupEmployer(
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

  get shouldShowEmailEmployerSignUpWarming() {
    const eControl = this.formSignupEmployer.get('employerSignupEmail');
    return eControl.invalid && eControl.touched;
  }

  get shouldShowNameEmployerSignUpWarming() {
    const nControl = this.formSignupEmployer.get('employerSignupName');
    return nControl.invalid && nControl.touched;
  }

  get shouldShowPasswordEmployerSignUpWarming() {
    const pControl = this.formSignupEmployer.get('employerSignupPassword');
    return pControl.invalid && pControl.touched;
  }

  Employersignin() {
    const role = { role: 'E' };
    this.employerService.SigninEmployer(
      this.formSigninEmployer.value.employerSigninEmail,
      this.formSigninEmployer.value.employerSigninPassword
    );
    this.store.select('user').subscribe(data => {
      this.employer = data;
      if (this.employer.success) {
        this.isSuccessSignin = true;
        localStorage.setItem('token', this.employer.employer.token.toString());
      }
      if (!this.employer.success) {
        this.isSuccessSignin = false;
      }

    });
  }

  get shouldShowEmailEmployerSignInWarming() {
    const eControl = this.formSigninEmployer.get('employerSigninEmail');
    return eControl.invalid && eControl.touched;
  }

  get shouldShowPasswordEmployerSignInWarming() {
    const pControl = this.formSigninEmployer.get('employerSigninPassword');
    return pControl.invalid && pControl.touched;
  }

  postjob() {
    this.route.navigate(['/postjob']);
  }

}

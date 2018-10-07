import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router/';
import { APICONFIG } from '../api.config';
import { MESSAGES } from '../messages';

@Injectable()
export class SigninSignupService {
  // Check has login
  isSuccessLogin = new BehaviorSubject<any> (0);

  // Inject service
  constructor(
    private http: Http,
    private store: Store<any>,
    private route: Router) {
    if (localStorage.getItem('token')) {
      this.setSuccess(true);
    }
  }

  // Get info when login success
  get isSuccess() {
    return this.isSuccessLogin.asObservable();
  }

  // Set info when login success
  public setSuccess(newValue) {
    this.isSuccessLogin.next(newValue);
  }

  // User login
  loginUser(email, password) {
    return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.USER.LOGIN}`, {email, password} ).toPromise()
    .then(res => {
      this.store.dispatch({ type: 'GET_USER', user: res.json() });
      this.setSuccess(true);
      console.log(res.json());
    })
    .catch(err => {
      console.log(err);
      this.setSuccess(false);
    });
  }

  // User save jobs
  saveJobUser(jobId) {
    if (jobId === '') {
      return;
    } else {
      const headers = new Headers({ 'Content-Type': 'application/json', 'token': localStorage.getItem('token') });
      return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.USER.SAVEJOB}${jobId}`, {}, { headers }).toPromise()
      .then(res => {
        console.log(res.json().user.listjobuser);
        this.store.dispatch({ type: 'SAVE_JOB', user: res.json().user.listjobuser });
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  // User signup
  signUp(name, email, password) {
    return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.USER.SIGNUP}`, {email, password, name}).toPromise()
    .then(res => {
      console.log(res.json());
      this.store.dispatch({ type: 'GET_USER', user: res.json() });
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Employer signup
  signupEmployer(name, email, password) {
    return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.EMPLOYER.SIGNUP}`,
                          {email, password, name, address: 'unknown', phone: 0} ).toPromise()
    .then(res => {
      this.store.dispatch({ type: 'GET_EMPLOYER', employer: res.json() });
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Empolyer signin
  signinEmployer(email, password) {
    return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.EMPLOYER.LOGIN}`, {email, password} ).toPromise()
    .then(res => {
      this.setSuccess(true);
      this.store.dispatch({ type: 'GET_EMPLOYER', employer: res.json() });
    })
    .catch(err => {
      console.log(err);
      this.setSuccess(false);
    });
  }

  // User send mail
  sendEmail(payload) {
    return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.USER.SENDMAIL}`, payload).toPromise()
    .then(res => {
      console.log(res.json());
      if (res.json().success) {
        alert(`${MESSAGES.ALERTSENDMAIL.SUCCESS}`);
      } else {
        alert(`${MESSAGES.ALERTSENDMAIL.ERROR}`);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  // User upload file when send mail
  uploadFile(file) {
    return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.USER.UPLOADFILE}`, file).toPromise()
    .then(res => {
      console.log(res.json());
      if (res.json().success) {
        alert(`${MESSAGES.UPLOADFILE.SUCCESS}`);
      } else {
        alert(`${MESSAGES.UPLOADFILE.ERROR}`);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }


}

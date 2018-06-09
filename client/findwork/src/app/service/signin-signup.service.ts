import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const SERVER_URL = 'http://localhost:3000/';

@Injectable()
export class SigninSignupService {
  isSuccessLogin = new BehaviorSubject<Boolean> (false);

  constructor(private http: Http, private store: Store<any>) {
    if (localStorage.getItem('token')) {
      this.setSuccess(true);
    } else {
      this.setSuccess(false);
    }
  }

  get isSuccess() {
    return this.isSuccessLogin.asObservable();
  }

  public setSuccess(newValue: boolean) {
    this.isSuccessLogin.next(newValue);
  }

  loginUser(email, password) {
    return this.http.post(SERVER_URL + 'user/signin', {email, password} ).toPromise()
    .then(res => {
      this.store.dispatch({ type: 'GET_USER', user: res.json() });
      this.setSuccess(true);
      console.log(this.isSuccessLogin);
    })
    .catch(err => {
      console.log(err.json());
      this.setSuccess(false);
    });
  }

  saveJobUser(jobId) {
    if (jobId === '') {
      return;
    } else {
      const headers = new Headers({ 'Content-Type': 'application/json', 'token': localStorage.getItem('token') });
      return this.http.post(SERVER_URL + 'user/savejob/' + jobId, {}, { headers }).toPromise()
      .then(res => {
        console.log(res.json().user.listjobuser);
        this.store.dispatch({ type: 'SAVE_JOB', user: res.json().user.listjobuser });
      })
      .catch(err => {
        console.log(err.json());
      });
    }
  }

  signIn(name, email, password) {
    return this.http.post(SERVER_URL + 'user/signup', {email, password, name} ).toPromise()
    .then(res => {
      console.log(res.json());
      this.store.dispatch({ type: 'GET_USER', user: res.json() });
    })
    .catch(err => {
      console.log(err.json());
    });
  }

}

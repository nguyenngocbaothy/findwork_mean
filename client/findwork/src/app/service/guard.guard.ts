import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Router } from '@angular/router/';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { APICONFIG } from '../api.config';

@Injectable()
export class GuardGuard implements CanActivate, OnInit {
  isAuth = false;
  role;

  constructor(private http: Http, private route: Router) {
  }

  ngOnInit() {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.checkToken()) {
      console.log('not token');
      this.route.navigateByUrl('/home');
      return false;
    }

    const role = next.data['roles'] as Array<string>;
    console.log(role[0]);
    if (role[0] === 'employer') {
      return this.getData('employer')
      .map(auth => {
        console.log(auth.json().success);
        if (auth.json().success) {
          if (auth.json().employer.role.indexOf(role) !== -1) {
            console.log('authenticated');
            return true;
          }
          this.route.navigateByUrl('/home');
          return false;
        }
        console.log('not authenticated');
        this.route.navigateByUrl('/home');
        return false;
      }).toPromise()
      .catch(err => {
        console.log('do not permission');
        this.route.navigateByUrl('/home');
        return false;
      });
    } else {
      return this.getData('user').map(auth => {
        console.log(auth.json());
        if (auth) {
          if (auth.json().user.role.indexOf(role) !== -1) {
            console.log('user authenticated');
            return true;
          }
          this.route.navigateByUrl('/home');
          return false;
        }
        console.log('user not authenticated');
        this.route.navigateByUrl('/home');
        return false;
      }).toPromise()
      .catch(err => {
        console.log('do not permission');
        this.route.navigateByUrl('/employers');
        return false;
      });
    }
  }

  getData(role) {
    const headers = new Headers({ 'Content-Type': 'application/json', 'token': localStorage.getItem('token') });
    return this.http.post(`${APICONFIG.BASEPOINT}${role}${APICONFIG.CHECKROLE.CHECK_ROLE}`, {}, { headers });
  }

  public checkToken(): boolean {
    if (!localStorage.getItem('token')) {
      return false;
    }
    return true;
  }

  public isAuthenticated() {
    if (!this.checkToken()) {
      return false;
    }
    return true;
  }

}

import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const SERVER_URL = 'http://localhost:3000/';
@Injectable()
export class JobsService {
  idEmployer: string;
  alljob = new BehaviorSubject([]);

  constructor(private http: Http) {
    console.log(this.idEmployer);
    if (this.idEmployer === undefined) {
      this.checkToken();
    }
  }

  checkToken() {
    const headers = new Headers({ 'Content-Type': 'application/json', 'token': localStorage.getItem('token') });
    return this.http.post(SERVER_URL + 'employer/check', {}, { headers }).toPromise()
    .then(res => {
      console.log(res.json());
      this.idEmployer = res.json().employer._id;
      this.getAllJobByIdEmployer(this.idEmployer);
    })
    .catch(err => {
      console.log(err);
    });
  }

  getAllJobByIdEmployer(id: string) {
    if (id !== undefined) {
      console.log('get job');
      return this.http.get(SERVER_URL + 'job/' + id).subscribe((data: any) => {
        console.log(data.json());
          this.alljob.next(data.json().newJob);
      });
    }
  }

}

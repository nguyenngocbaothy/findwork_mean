import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const SERVER_URL = 'http://localhost:3000/';
@Injectable()
export class JobsService {
  idEmployer: string;
  alljob = new BehaviorSubject([]);

  constructor(private http: Http) {
      this.checkToken();
  }

  checkToken() {
    const headers = new Headers({ 'Content-Type': 'application/json', 'token': localStorage.getItem('token') });
    return this.http.post(SERVER_URL + 'employer/check', {}, { headers }).toPromise()
    .then(res => {
      this.idEmployer = res.json().employer._id;
      this.getAllJobByIdEmployer(this.idEmployer);
    })
    .catch(err => {
      console.log(err);
    });
  }

  getAllJobByIdEmployer(id: string) {
    if (id !== undefined) {
      return this.http.get(SERVER_URL + 'job/' + id).subscribe((data: any) => {
        console.log(data.json());
          this.alljob.next(data.json().newJob);
      });
    }
  }

  addJob(payload) {
    return this.http.post(SERVER_URL + 'job/' + this.idEmployer, payload).subscribe(data => {
      if (data.json().success) {
        this.getAllJobByIdEmployer(this.idEmployer);
        alert('Add job successfully!');
      } else {
        alert('Error add job');
      }
    });
  }

  deleteJob(idJob) {
    const headers = new Headers({ 'Content-Type': 'application/json', 'token': localStorage.getItem('token') });
    return this.http.delete(SERVER_URL + 'job/' + idJob, { headers }).subscribe(data => {
      console.log(data.json());
      if (data.json().success) {
        this.getAllJobByIdEmployer(this.idEmployer);
        alert('Delete job successfully!');
      } else {
        alert('Error delete job');
      }
    });
  }

}

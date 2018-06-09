import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';

const SERVER_URL = 'http://localhost:3000/';

@Injectable()
export class CateService {
  location: string[] = ['HCM', 'HaNoi'];
  searchWord: string;

  constructor(private http: Http, private store: Store<any>) { }

  getcategory() {
    return this.http.get(SERVER_URL + 'category/').toPromise()
    .then(res => {
      // console.log(res.json().categories[0].name);
      this.store.dispatch({ type: 'GET_CATEGORIES', categories: res.json().categories });

    })
    .catch(err => console.log(err.json()));
  }

  search(key, cate, loca) {
    if (cate === 'All category') {
      cate = '';
    }
    if (loca === 'All Location') {
      loca = '';
    }
    return this.http.post(SERVER_URL + 'job/search', { key, cate, loca }).toPromise()
      .then(res => {
        this.store.dispatch({ type: 'GET_JOBS', jobs: res.json().job });
      })
      .catch(err => console.log(err.json()));
  }

  getAllJobs() {
    return this.http.get(SERVER_URL + 'job/').toPromise()
    .then(res => {
      this.store.dispatch({ type: 'GET_ALL_JOBS', jobs: res.json().newJob });
    })
    .catch(err => console.log(err.json()));
  }

  getJobById(jobId) {
    return this.http.get(SERVER_URL + 'job/getjob/' + jobId).toPromise()
    .then(res => {
      // console.log(res.json());
      this.store.dispatch({ type: 'GET_JOB', jobs: res.json().newJob });
    })
    .catch(err => console.log(err.json()));
  }

  getCategoryById(cateId) {
    return this.http.get(SERVER_URL + 'category/' + cateId).toPromise()
    .then(res => {
      this.store.dispatch({ type: 'GET_CATEGORY', category: res.json().category });
    })
    .catch(err => console.log(err.json()));
  }

}

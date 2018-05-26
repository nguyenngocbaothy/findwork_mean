import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';

const SERVER_URL = 'http://localhost:3000/';

@Injectable()
export class CateService {

  constructor(private http: Http, private store: Store<any>) { }

  getcategory() {
    return this.http.get(SERVER_URL + 'category/').toPromise()
    .then(res => {
      // console.log(res.json().categories[0].name);
      this.store.dispatch({ type: 'GET_CATEGORIES', categories: res.json().categories });

    })
    .catch(err => console.log(err.json()));
  }

}

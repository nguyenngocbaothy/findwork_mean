import { Component, OnInit } from '@angular/core';
import { CateService } from '../service/cate.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SigninSignupService } from '../service/signin-signup.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  job = {};
  category = {};
  hasLoad = false;
  isLogin: any = false;

  constructor(
    private cate: CateService,
    private activeRoute: ActivatedRoute,
    private store: Store<any>,
    private user: SigninSignupService
  ) {
    const routeParams = this.activeRoute.snapshot.params;
    if (!routeParams) {
      return;
    }
    this.cate.getJobById(routeParams.id).then(() => {
      this.getData();
    });
  }

  ngOnInit() {
    this.user.isSuccess.subscribe(isLogin => {
      this.isLogin = isLogin;
  });
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  getData() {
    this.store.select('jobs').subscribe(job => {
      this.job = job;
      if (!(this.job && (Object.keys(this.job).length === 0))) {
        this.cate.getCategoryById(job.category);
      }
    });

    if (!(this.job && (Object.keys(this.job).length === 0))) {
      this.store.select('category').subscribe(category => {
        this.category = category;
      });
    }
  }

}

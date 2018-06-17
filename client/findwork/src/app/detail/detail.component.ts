import { Component, OnInit } from '@angular/core';
import { CateService } from '../service/cate.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SigninSignupService } from '../service/signin-signup.service';
import { Category } from '.././types';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  job: any;
  category: Category;
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
    this.cate.getJobById(routeParams.id).subscribe((data) => {
      this.job = data.json().newJob;
      console.log(this.job);
      this.getData();
    });
  }

  ngOnInit() {
    this.user.isSuccess.subscribe(isLogin => {
      this.isLogin = isLogin;
  });
  }

  getData() {
    // this.store.select('jobs').subscribe(job => {
    //   this.job = job;
    //   console.log(job);
      if (Object.keys(this.job).length !== 0) {
        this.cate.getCategoryById(this.job.category).subscribe(category => {
          this.category = category.json();
        });
    // });

    // if (Object.keys(this.job).length !== 0) {
      // this.store.select('category').subscribe(category => {
      //   this.category = category;
      //   console.log(this.category);
      // });
    // }
  }

}

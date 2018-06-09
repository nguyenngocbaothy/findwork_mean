import { Component, OnInit } from '@angular/core';
import { CateService } from '../service/cate.service';
import { Store } from '@ngrx/store';
import { Category } from '../types';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SigninSignupService } from '../service/signin-signup.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  categories: Category[] = [];
  location: string[] = [];
  jobs: any[];
  allJobs: any[];
  jobUser: any[];

  searchWord: string;

  formSearch: FormGroup;

  isLogin: any = false;

  constructor(private cate: CateService, private store: Store<any>, private fb: FormBuilder, private user: SigninSignupService) {
    this.location = this.cate.location;
    this.store.select('category').subscribe(categories => this.categories = categories);
    this.store.select('jobs').subscribe(jobs => {
      this.allJobs = jobs;
    });

    // this.formSearch.controls['search'].setValue(this.cate.searchWord);
  }

  ngOnInit() {
    this.cate.getcategory();
    this.formSearch = this.fb.group({
      search: '',
      cate : 'All category',
      loca : 'All Location'
    });

    this.cate.getAllJobs();

    this.user.isSuccess.subscribe(isLogin => {
        this.isLogin = isLogin;
    });
  }

  onSubmitForm() {
    // this.cate.searchWord = this.formSearch.value.search;
    this.cate.search(this.formSearch.value.search.toLowerCase(), this.formSearch.value.cate, this.formSearch.value.loca);
    this.store.select('jobs').subscribe(jobs => {
      this.jobs = jobs;
    });
  }

  saveJob(jobId) {
    this.user.saveJobUser(jobId);
    this.store.select('user').subscribe(jobUser => {
      this.jobUser = jobUser;
      console.log(this.jobUser.length);
    });
  }

}

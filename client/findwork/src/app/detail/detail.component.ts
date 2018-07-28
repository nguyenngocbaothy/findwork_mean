import { Component, OnInit } from '@angular/core';
import { CateService } from '../service/cate.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SigninSignupService } from '../service/signin-signup.service';
import { Category } from '.././types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  idEmployer: string;
  uploadData;
  filename: string;

  applyForm: FormGroup;

  constructor(
    private cate: CateService,
    private activeRoute: ActivatedRoute,
    private store: Store<any>,
    private user: SigninSignupService,
    private fb: FormBuilder
  ) {
    const routeParams = this.activeRoute.snapshot.params;
    if (!routeParams) {
      return;
    }
    this.cate.getJobById(routeParams.id).subscribe((data) => {
      this.job = data.json().newJob;
      console.log(this.job);
      this.idEmployer = this.job.employer;
      this.getData();
    });
  }

  ngOnInit() {
    this.user.isSuccess.subscribe(isLogin => {
      this.isLogin = isLogin;
    });

    this.applyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
      introduce: ['', Validators.required]
    });
  }

  getData() {
    // this.store.select('jobs').subscribe(job => {
    //   this.job = job;
    //   console.log(job);
    if (Object.keys(this.job).length !== 0) {
      this.cate.getCategoryById(this.job.category).subscribe(category => {
        this.category = category.json();
        console.log(this.category);
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

  get shouldShowNameWarming() {
    const eControl = this.applyForm.get('name');
    return eControl.invalid && eControl.touched;
  }

  get shouldShowEmailWarming() {
    const eControl = this.applyForm.get('email');
    return eControl.invalid && eControl.touched;
  }

  get shouldShowPasswordWarming() {
    const eControl = this.applyForm.get('password');
    return eControl.invalid && eControl.touched;
  }

  get shouldShowIntroduceWarming() {
    const eControl = this.applyForm.get('introduce');
    return eControl.invalid && eControl.touched;
  }

  send() {
    this.applyForm.value.idEmployer = this.idEmployer;
    this.applyForm.value.filename = this.filename;
    console.log(this.applyForm.value);
    this.user.sendEmail(this.applyForm.value);
  }

  fileChange(event) {
    const selectedFile = <File>event.target.files[0];
    this.uploadData = new FormData();
    this.uploadData.append('file', selectedFile, selectedFile.name);
    this.filename = selectedFile.name;
    console.log(this.uploadData, selectedFile);
    this.user.uploadFile(this.uploadData);
  }



}

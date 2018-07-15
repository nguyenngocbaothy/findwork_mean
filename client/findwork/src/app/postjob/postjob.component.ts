import { Component, OnInit } from '@angular/core';
import { JobsService } from '../service/jobs.service';
import { CateService } from '../service/cate.service';
import { Category } from '../types';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {
  alljob = [];
  jobChoosen: any = {};
  categories: Category[] = [];
  formAddJob: FormGroup;
  formUpdateJob: FormGroup;
  tempcate = [];

  constructor(
    private jobsService: JobsService,
    private cate: CateService,
    private store: Store<any>,
    private fb: FormBuilder
  ) {
   this.getData();

    this.cate.getcategory();
  }

  getData() {
    this.jobsService.alljob.asObservable().subscribe(data => {
      if (data.length === 0) {
        this.jobsService.checkToken();
      }
      this.alljob = data;
    });
  }

  ngOnInit() {
    this.formAddJob = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      salary: ['', Validators.required],
      company: ['', Validators.required],
      description: ['', Validators.required],
      requirement: ['', Validators.required],
      benefit: ['', Validators.required]
    });
    this.validateUpdateForm();

    this.store.select('category').subscribe(categories => {
      this.categories = categories;
      console.log(this.categories);
      // if (this.categories.length > 0) {
      //   console.log(this.categories[0].name);
      //   this.formAddJob.controls.category.setValue({
      //     'category': this.categories[0].name
      //   });
      // }
    });
  }

  selectRow(job) {
    console.log(job);
    this.jobChoosen = job;

    this.tempcate = this.categories;
    console.log(this.tempcate, this.categories);
    // this.tempcate.forEach(e => {
    //   if (this.jobChoosen.category === e._id) {
    //     const index = this.tempcate.indexOf(e);
    //     this.tempcate.splice(index, 1);
    //     this.tempcate.unshift(e);
    //     console.log(this.tempcate);
    //   }
    // });
    // this.tempcate = [];

    this.validateUpdateForm(
      this.jobChoosen.title,
      this.jobChoosen.location,
      this.jobChoosen.salary,
      this.jobChoosen.company,
      this.jobChoosen.detail.description,
      this.jobChoosen.detail.requirement,
      this.jobChoosen.detail.benefit
    );
  }

  validateUpdateForm(title?, location?, salary?, company?, description?, requirement?, benefit?) {
    this.formUpdateJob = this.fb.group({
      titleupdate: [title, Validators.required],
      categoryupdate: ['', Validators.required],
      locationupdate: [location, Validators.required],
      salaryupdate: [salary, Validators.required],
      companyupdate: [company, Validators.required],
      descriptionupdate: [description, Validators.required],
      requirementupdate: [requirement, Validators.required],
      benefitupdate: [benefit, Validators.required]
    });
  }

  deleteJob() {
    console.log(this.jobChoosen._id);
    this.jobsService.deleteJob(this.jobChoosen._id);
  }

  updateJob() {
    console.log(this.jobChoosen._id);
    console.log(this.formUpdateJob.value);
  }

  addJob() {
    const payload = {
      'category': this.formAddJob.value.category,
      'location': this.formAddJob.value.location,
      'title': this.formAddJob.value.title,
      'salary': this.formAddJob.value.salary,
      'company': this.formAddJob.value.company,
      'detail': {
        'description': this.formAddJob.value.description,
        'requirement': this.formAddJob.value.requirement,
        'benefit': this.formAddJob.value.benefit
      }
    };
    console.log(payload);
    this.jobsService.addJob(payload);
  }

}

import { Component, OnInit } from '@angular/core';
import { JobsService } from '../service/jobs.service';
import { CateService } from '../service/cate.service';
import { Category } from '../types';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { log } from 'util';

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
  temp2cate = [];

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
      if (this.categories.length > 0) {
        this.formAddJob.controls['category'].setValue(this.categories[0]._id);
      }
    });

    this.formAddJob.controls['location'].setValue('HCM');
  }

  selectRow(job) {
    this.jobChoosen = job;
    console.log(this.jobChoosen.category);

    // this.temp2cate = [];
    // this.tempcate = [];
    // this.tempcate = this.categories;

    // this.tempcate.forEach(e => {
    //   if (e._id === this.jobChoosen.category) {
    //     const index = this.tempcate.indexOf(e);
    //     this.tempcate.splice(index, 1);
    //     this.tempcate.unshift(e);

    //     this.temp2cate = this.tempcate.reverse();
    //   }
    // });

    this.validateUpdateForm(
      this.jobChoosen.title,
      this.jobChoosen.category,
      this.jobChoosen.location,
      this.jobChoosen.salary,
      this.jobChoosen.company,
      this.jobChoosen.detail.description,
      this.jobChoosen.detail.requirement,
      this.jobChoosen.detail.benefit
    );
  }

  validateUpdateForm(title?, category?, location?, salary?, company?, description?, requirement?, benefit?) {
    this.formUpdateJob = this.fb.group({
      titleupdate: [title, Validators.required],
      categoryupdate: [category, Validators.required],
      locationupdate: [location, Validators.required],
      salaryupdate: [salary, Validators.required],
      companyupdate: [company, Validators.required],
      descriptionupdate: [description, Validators.required],
      requirementupdate: [requirement, Validators.required],
      benefitupdate: [benefit, Validators.required]
    });
  }

  deleteJob() {
    this.jobsService.deleteJob(this.jobChoosen._id);
  }

  updateJob() {
    console.log(this.jobChoosen._id);
    const payload = {
      'category': this.formUpdateJob.value.categoryupdate,
      'location': this.formUpdateJob.value.locationupdate,
      'title': this.formUpdateJob.value.titleupdate,
      'salary': this.formUpdateJob.value.salaryupdate,
      'company': this.formUpdateJob.value.companyupdate,
      'detail': {
        'description': this.formUpdateJob.value.descriptionupdate,
        'requirement': this.formUpdateJob.value.requirementupdate,
        'benefit': this.formUpdateJob.value.benefitupdate
      }
    };
    // console.log(payload);
    this.jobsService.updateJob(this.jobChoosen._id, payload);
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
    this.jobsService.addJob(payload);
    this.formAddJob.reset();
  }

}

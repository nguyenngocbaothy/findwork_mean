import { Component, OnInit } from '@angular/core';
import { JobsService } from '../service/jobs.service';
import { CateService } from '../service/cate.service';
import { Category } from '../types';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { log } from 'util';
import { MESSAGES } from '../messages';

@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {

  // Message validate title
  VALIDATE_TITLE = `${MESSAGES.VALIDATE_JOB.TITLE_REQUIRED}`;
  // Message validate salary
  VALIDATE_SALARY = `${MESSAGES.VALIDATE_JOB.SALARY_REQUIRED}`;
  // Message validate company
  VALIDATE_COMPANY = `${MESSAGES.VALIDATE_JOB.COMPANY_REQUIRED}`;
  // Message validate end day
  VALIDATE_ENDDAY = `${MESSAGES.VALIDATE_JOB.ENDDAY_REQUIRED}`;
  // Message validate description
  VALIDATE_DESCRIPTION = `${MESSAGES.VALIDATE_JOB.DESCRIPTION_REQUIRED}`;
  // Message validate requirement
  VALIDATE_REQUIREMENT = `${MESSAGES.VALIDATE_JOB.REQUIREMENT_REQUIRED}`;
  // Message validate benefit
  VALIDATE_BENEFIT = `${MESSAGES.VALIDATE_JOB.BENEFIT_REQUIRED}`;

  // list jobs
  alljob = [];

  // object job is choose
  jobChoosen: any = {};

  // list categories have type Category
  categories: Category[] = [];

  // form group
  formAddJob: FormGroup;
  formUpdateJob: FormGroup;

  // inject service
  constructor(
    private jobsService: JobsService,
    private cate: CateService,
    private store: Store<any>,
    private fb: FormBuilder
  ) {
   this.getData();

    this.cate.getcategory();
  }

  // get all jobs
  getData() {
    this.jobsService.alljob.asObservable().subscribe(data => {
      if (data.length === 0) {
        this.jobsService.checkToken();
      }
      this.alljob = data;
    });
  }

  ngOnInit() {
    // (2) Xử lý thêm công việc
    // (2).2. Xử lý check
    // (2).2.a. Check hạng mục

    // init form group for form add job
    this.formAddJob = this.fb.group({
      // (2).2.a.1 Check hạng Tile
      title: ['', Validators.required],
      // (2).2.a.2 Check hạng mục category
      category: ['', Validators.required],
      // (2).2.a.3 Check hạng mục location
      location: ['', Validators.required],
      // (2).2.a.4 Check hạng mục salary
      salary: ['', Validators.required],
      // (2).2.a.5 Check hạng mục company
      company: ['', Validators.required],
      // (2).2.a.7 Check hạng mục description
      description: ['', Validators.required],
      // (2).2.a.8 Check hạng mục requiment
      requirement: ['', Validators.required],
      // (2).2.a.9 Check hạng mục benefit
      benefit: ['', Validators.required],
      // (2).2.6. Check hạng mục endDate
      endDate: ['', Validators.required]
    });

    this.validateUpdateForm();

    // get list categories and set value for category and location
    this.store.select('category').subscribe(categories => {
      this.categories = categories;
      if (this.categories.length > 0) {
        this.formAddJob.controls['category'].setValue(this.categories[0]._id);
      }
    });
    this.formAddJob.controls['location'].setValue('HCM');
  }

  // select info of job which is choosen
  selectRow(job) {
    this.jobChoosen = job;
    console.log(this.jobChoosen.category);

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

  // (2) Xử lý sửa công việc
  // (2).2. Xử lý check
  // (2).2.a. Check hạng mục

  // set value for form update job
  validateUpdateForm(title?, category?, location?, salary?, company?, description?, requirement?, benefit?) {
    this.formUpdateJob = this.fb.group({
      // (2).2.a.1 check hạng mục title
      titleupdate: [title, Validators.required],
      // (2).2.a.2 Check hạng mục categoty
      categoryupdate: [category, Validators.required],
      // (2).2.a.3 Check hạng mục location
      locationupdate: [location, Validators.required],
      // (2).2.a.4 Check hạng mục salary
      salaryupdate: [salary, Validators.required],
      // (2).2.a.5 Check hạng mục company
      companyupdate: [company, Validators.required],
      // (2).2.a.6 Check hạng mục description
      descriptionupdate: [description, Validators.required],
      // (2).2.a.7 Check hạng mục requirement
      requirementupdate: [requirement, Validators.required],
      // (2).2.a.8 Check hạng mục benefit
      benefitupdate: [benefit, Validators.required]
    });
  }

  
  // delete job
  deleteJob() {
    this.jobsService.deleteJob(this.jobChoosen._id);
  }

  // Thiết_kế Update Job
  // (2) Xử lý sửa công việc
  // (2).3. Xử lý lưu thông tin công việc

  // update job
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

  // Thiết_kế Add Job
  // (2) Xử lý thêm công việc
  // (2).3. Xử lý lưu thông tin công việc

  // add job
  addJob() {
    const payload = {
      'category': this.formAddJob.value.category,
      'location': this.formAddJob.value.location,
      'title': this.formAddJob.value.title,
      'salary': this.formAddJob.value.salary,
      'company': this.formAddJob.value.company,
      'endDate': this.formAddJob.value.endDate,
      'detail': {
        'description': this.formAddJob.value.description,
        'requirement': this.formAddJob.value.requirement,
        'benefit': this.formAddJob.value.benefit
      }
    };
    console.log(this.formAddJob.value.endDate);
    this.jobsService.addJob(payload);
    this.formAddJob.reset();
  }

}

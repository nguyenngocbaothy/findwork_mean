import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobsService } from '../service/jobs.service';
import { CateService } from '../service/cate.service';
import { Store } from '@ngrx/store';
import { Category } from '../types';

@Component({
  selector: 'app-findjob',
  templateUrl: './findjob.component.html',
  styleUrls: ['./findjob.component.css']
})
export class FindjobComponent implements OnInit {

  // form Group
  formFindjob: FormGroup;

  // list categories
  categories: Category[] = [];
  
  // list job
  listJob = [];

  constructor(
    private fb: FormBuilder,
    private jobService: JobsService,
    private cate: CateService,
    private store: Store<any>
  ) {
    this.cate.getcategory();
  }

  // Thiết_kế Find Dream Job User
  // (1) Khởi tạo ban đầu
  // 1. Thực hiện khởi tạo màn hình ban đầu
  ngOnInit() {
    this.formFindjob = this.fb.group({
      // 1.1
      findJobTitle: [''],
      // 1.2
      findJobLocation: ['HCM'],
      // 1.3
      findJobSalary : [''],
      // 1.4
      findJobCategory: [''],
      // 1.5
      findJobcompany: [''],
      // 1.6
      findJobExperience : [''],
      // 1.7
      findJobLevel: [''],
      // 1.8
      findJobCertificate: [''],
      // 1.9
      findJobNumberTitle: [0],
      // 1.10
      findJobNumberLocation: [0],
      // 1.11
      findJobNumbersalary : [0],
      // 1.12
      findJobNumberCategory: [0],
      // 1.13
      findJobNumberCompany: [0],
      // 1.14
      findJobNumberExperience : [0],
      // 1.15
      findJobNumberLevel: [0],
      // 1.16
      findJobNumberCertificate: [0],
    });

    // 1.4
    this.store.select('category').subscribe(categories => {
      this.categories = categories;
      if (this.categories.length > 0) {
        this.formFindjob.controls['findJobCategory'].setValue(this.categories[0]._id);
      }
    });
  }

  // Thiết_kế Find Dream Job User
  // (2) Xử lý tìm kiếm
  // (2).3.b.1 Xử lí tìm kiếm công việc
  findDreamJob() {
    this.jobService.findDreamJob(this.formFindjob.value)
    // (2).3.b.4 trả về công việc có điểm cao nhất
    .subscribe(data => {
      this.listJob = data.json().data;
      console.log(this.listJob);
    });
  }

}

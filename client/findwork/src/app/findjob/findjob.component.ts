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

  formFindjob: FormGroup;
  categories: Category[] = [];
  listJob = [];

  constructor(
    private fb: FormBuilder,
    private jobService: JobsService,
    private cate: CateService,
    private store: Store<any>
  ) {
    this.cate.getcategory();
  }

  ngOnInit() {
    this.formFindjob = this.fb.group({
      findJobTitle: [''],
      findJobLocation: ['HCM'],
      findJobSalary : [''],
      findJobCategory: [''],
      findJobcompany: [''],
      findJobExperience : [''],
      findJobLevel: [''],
      findJobCertificate: [''],
      findJobNumberTitle: [''],
      findJobNumberLocation: [''],
      findJobNumbersalary : [''],
      findJobNumberCategory: [''],
      findJobNumberCompany: [''],
      findJobNumberExperience : [''],
      findJobNumberLevel: [''],
      findJobNumberCertificate: [''],
    });

    this.store.select('category').subscribe(categories => {
      this.categories = categories;
      if (this.categories.length > 0) {
        this.formFindjob.controls['findJobCategory'].setValue(this.categories[0]._id);
      }
    });
  }

  findDreamJob() {
    console.log(this.formFindjob.value);
    this.jobService.findDreamJob(this.formFindjob.value).subscribe(data => {
      this.listJob = data.json().data;
      console.log(this.listJob);
    });
  }

}

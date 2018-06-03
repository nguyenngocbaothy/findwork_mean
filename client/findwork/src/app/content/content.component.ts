import { Component, OnInit } from '@angular/core';
import { CateService } from '../service/cate.service';
import { Store } from '@ngrx/store';
import { Category } from '../types';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  formSearch: FormGroup;

  constructor(private cate: CateService, private store: Store<any>, private fb: FormBuilder) {
    this.location = this.cate.location;
    this.store.select('category').subscribe(categories => this.categories = categories);
    this.store.select('jobs').subscribe(jobs => {
      this.allJobs = jobs;
    });

  }

  ngOnInit() {
    this.cate.getcategory();
    this.formSearch = this.fb.group({
      search: '',
      cate : 'All category',
      loca : 'All Location'
    });

    this.cate.getAllJobs();
  }

  onSubmitForm() {
    this.cate.search(this.formSearch.value.search.toLowerCase(), this.formSearch.value.cate, this.formSearch.value.loca);
    this.store.select('jobs').subscribe(jobs => {
      this.jobs = jobs;
    });
  }

}

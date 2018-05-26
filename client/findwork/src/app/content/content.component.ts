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
  location: string[] = ['TPHCM', 'HaNoi'];

  formSearch: FormGroup;

  constructor(private cate: CateService, private store: Store<any>, private fb: FormBuilder) {
    this.store.select('category').subscribe(categories => this.categories = categories);
  }

  ngOnInit() {
    this.cate.getcategory();
    this.formSearch = this.fb.group({
      search: '',
      cate : 'All category',
      loca : 'All Location'
    });
  }

  onSubmitForm() {
    console.log(this.formSearch.value);
  }

}

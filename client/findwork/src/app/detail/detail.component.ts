import { Component, OnInit } from '@angular/core';
import { CateService } from '../service/cate.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  job = {};
  category = {};
  isJob = false;

  constructor(private cate: CateService, private activeRoute: ActivatedRoute, private store: Store<any>) {
    this.store.select('jobs').subscribe(job => {
      this.job = job;
      this.cate.getCategoryById(job.category);
      if ( this.job !== null) {
        this.isJob = true;
      }
    });

    this.store.select('category').subscribe(category => {
      this.category = category;
      console.log(this.category);
    });
  }

  ngOnInit() {
    const routeParams = this.activeRoute.snapshot.params;
    this.cate.getJobById(routeParams.id);
  }

}

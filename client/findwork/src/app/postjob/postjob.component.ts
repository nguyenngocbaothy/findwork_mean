import { Component, OnInit } from '@angular/core';
import { JobsService } from '../service/jobs.service';

@Component({
  selector: 'app-postjob',
  templateUrl: './postjob.component.html',
  styleUrls: ['./postjob.component.css']
})
export class PostjobComponent implements OnInit {
  alljob = [];
  jobChoosen: any = {};

  constructor(private jobsService: JobsService) {
    this.jobsService.alljob.asObservable().subscribe(data => {
      console.log(data);
      this.alljob = data;
    });
  }

  ngOnInit() {
  }

  selectRow(job) {
    this.jobChoosen = job;
  }

  deleteJob() {
    console.log(this.jobChoosen._id);
  }

  updateJob() {
    console.log(this.jobChoosen._id);
  }

  addJob() {

  }

}

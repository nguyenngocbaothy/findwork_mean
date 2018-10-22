import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { APICONFIG } from '../api.config';
import { MESSAGES } from '../messages';


const SERVER_URL = 'http://localhost:3000/';
@Injectable()
export class JobsService {
  // id of employer
  idEmployer: string;

  // list jobs
  alljob = new BehaviorSubject([]);

  constructor(private http: Http) {
      this.checkToken();
  }

  // Check token is authen
  checkToken() {
    const headers = new Headers({ 'Content-Type': 'application/json', 'token': localStorage.getItem('token') });
    return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.CHECKTOKEN.EMPLOYER_TOKEN}`, {}, { headers })
    .toPromise()
    .then(res => {
      this.idEmployer = res.json().employer._id;
      this.getAllJobByIdEmployer(this.idEmployer);
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Thiêt_kế List Work Employer
  // (2).4

  // get list of jobs
  getAllJobByIdEmployer(id: string) {
    if (id !== undefined) {
      return this.http.get(SERVER_URL + 'job/' + id).subscribe((data: any) => {
        console.log(data.json());
          this.alljob.next(data.json().newJob);
      });
    }
  }

  // Thiết_kế Add Job
  // (2) Xử lý thêm công việc
  // (2).3

  // add job
  addJob(payload) {
    return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.JOB.ADD}${this.idEmployer}`, payload)
    .subscribe(data => {
      if (data.json().success) {
        this.getAllJobByIdEmployer(this.idEmployer);
        alert(`${MESSAGES.ADDJOB.SUCCESS}`);
      } else {
        alert(`${MESSAGES.ADDJOB.ERROR}`);
      }
    });
  }

  // Thiết_kế Delete Job
  // (2) Xử lý xóa công việc
  // (2).3

  // delete job
  deleteJob(idJob) {
    const headers = new Headers({ 'Content-Type': 'application/json', 'token': localStorage.getItem('token')});
    return this.http.delete(`${APICONFIG.BASEPOINT}${APICONFIG.JOB.DELETE}${idJob}`, { headers })
    .subscribe(data => {
      console.log(data.json());
      if (data.json().success) {
        this.getAllJobByIdEmployer(this.idEmployer);
        alert(`${MESSAGES.DELETEJOB.SUCCESS}`);
      } else {
        alert(`${MESSAGES.DELETEJOB.ERROR}`);
      }
    });
  }

  // Thiết_kế Update Job
  // (2) Xử lý sửa công việc
  // (2).3

  // update job
  updateJob(idJob, payload) {
    const headers = new Headers({ 'Content-Type': 'application/json', 'token': localStorage.getItem('token') });
    return this.http.put(`${APICONFIG.BASEPOINT}${APICONFIG.JOB.UPDATE}${idJob}`, payload, { headers })
    .subscribe(data => {
      console.log(data.json());
      if (data.json().success) {
        this.getAllJobByIdEmployer(this.idEmployer);
        alert(`${MESSAGES.UPDATEJOB.SUCCESS}`);
      } else {
        alert(`${MESSAGES.UPDATEJOB.ERROR}`);
      }
    });
  }

  // find job by score
  findDreamJob(payload) {
    return this.http.post(`${APICONFIG.BASEPOINT}${APICONFIG.DREAMJOB.FIND}`, payload);
  }

}

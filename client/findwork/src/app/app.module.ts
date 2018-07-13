import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { EmployersComponent } from './employers/employers.component';
import { DetailComponent } from './detail/detail.component';
import { PostjobComponent } from './postjob/postjob.component';
import { FindjobComponent } from './findjob/findjob.component';

import { CateService } from './service/cate.service';
import { SigninSignupService } from './service/signin-signup.service';
import { GuardGuard } from './service/guard.guard';
import { JobsService } from './service/jobs.service';


// reducers
import { categoryReducer } from './ngrx/categoryReducer';
import { jobsReducer } from './ngrx/jobsReducer';
import { userReducer } from './ngrx/userReducer';


const routersConfig: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'alljobs',
    component: ContentComponent
    // children: [
    //   { path: 'detail', component: DetailComponent }
    // ]
  },
  { path: 'employers', component: EmployersComponent },
  { path: 'detail/:id', component: DetailComponent, pathMatch: 'full' },
  { path: 'postjob', component: PostjobComponent,
    canActivate: [GuardGuard],
    data: {roles: ['employer']}
  },
  { path: 'findjob', component: FindjobComponent,
  canActivate: [GuardGuard],
  data: {roles: ['user']}
  },
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    FooterComponent,
    ContentComponent,
    EmployersComponent,
    DetailComponent,
    PostjobComponent,
    FindjobComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routersConfig),
    HttpModule,
    StoreModule.forRoot({
      category: categoryReducer,
      jobs: jobsReducer,
      user: userReducer
    }),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CateService, SigninSignupService, GuardGuard, JobsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { EmployersComponent } from './employers/employers.component';
import { DetailComponent } from './detail/detail.component';


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
  { path: 'alljobs/detail', component: DetailComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    FooterComponent,
    ContentComponent,
    EmployersComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routersConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

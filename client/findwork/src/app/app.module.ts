import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';


const routersConfig: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'alljobs', component: ContentComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    FooterComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routersConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

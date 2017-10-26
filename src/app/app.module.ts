import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Import Pages.
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserLoginPageComponent } from './pages/user-login-page/user-login-page.component';
import { UserLogoutPageComponent } from './pages/user-logout-page/user-logout-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { DataPageComponent } from './pages/submission-pages/data-page/data-page.component';
import { ProjectPageComponent } from './pages/submission-pages/project-page/project-page.component';
import { TeamPageComponent } from './pages/submission-pages/team-page/team-page.component';
import { OverviewPageComponent } from './pages/submission-pages/overview-page/overview-page.component';
import { SubmitPageComponent } from './pages/submission-pages/submit-page/submit-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { LibraryPageComponent } from './pages/library-page/library-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';

// Import Components.
import { EbiHeaderComponent } from './components/ebi-header/ebi-header.component';
import { EbiNavbarComponent } from './components/ebi-navbar/ebi-navbar.component';
import { EbiFooterComponent } from './components/ebi-footer/ebi-footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotFoundPageComponent,
    UserPageComponent,
    UserLoginPageComponent,
    UserLogoutPageComponent,
    EbiHeaderComponent,
    EbiNavbarComponent,
    EbiFooterComponent,
    DataPageComponent,
    ProjectPageComponent,
    TeamPageComponent,
    OverviewPageComponent,
    SubmitPageComponent,
    DashboardPageComponent,
    LibraryPageComponent,
    HelpPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

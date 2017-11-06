import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthService, TokenService } from 'angular-aap-auth';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtHelper } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Import Pages.
import { HomePageComponent } from './pages/home-page/home-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserLoginPageComponent } from './pages/user-login-page/user-login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NotAuthenticatedPageComponent } from './pages/not-authenticated-page/not-authenticated-page.component';
import { DataPageComponent } from './pages/submission-pages/data-page/data-page.component';
import { OverviewPageComponent } from './pages/submission-pages/overview-page/overview-page.component';
import { SubmitPageComponent } from './pages/submission-pages/submit-page/submit-page.component';
import { StudyPageComponent } from './pages/submission-pages/study-page/study-page.component';
import { ExperimentPageComponent } from './pages/submission-pages/experiment-page/experiment-page.component';
import { SamplesPageComponent } from './pages/submission-pages/samples-page/samples-page.component';
import { ContactsPageComponent } from './pages/submission-pages/contacts-page/contacts-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { LibraryPageComponent } from './pages/library-page/library-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';

// Import Components.
import { EbiHeaderComponent } from './components/ebi-header/ebi-header.component';
import { EbiNavbarComponent } from './components/ebi-navbar/ebi-navbar.component';
import { EbiFooterComponent } from './components/ebi-footer/ebi-footer.component';

// Import Guards.
import { LoggedInGuard } from './guards/logged-in/logged-in.guard';

// Import Tests Classes.
import { RouterLinkStubDirective, RouterOutletStubComponent } from './testing/router.stubs';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotFoundPageComponent,
    NotAuthenticatedPageComponent,
    UserPageComponent,
    UserLoginPageComponent,
    EbiHeaderComponent,
    EbiNavbarComponent,
    EbiFooterComponent,
    DataPageComponent,
    StudyPageComponent,
    ExperimentPageComponent,
    SamplesPageComponent,
    ContactsPageComponent,
    OverviewPageComponent,
    SubmitPageComponent,
    DashboardPageComponent,
    LibraryPageComponent,
    HelpPageComponent,
    RouterLinkStubDirective,
    RouterOutletStubComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    LoggedInGuard,
    JwtHelper,
    TokenService,
    AuthService, {
      provide: 'AAP_CONFIG',
      useValue: {
        authURL: 'https://explore.api.aap.tsi.ebi.ac.uk'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

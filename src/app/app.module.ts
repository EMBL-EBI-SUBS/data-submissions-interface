import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthModule } from 'angular-aap-auth';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { AppRoutingModule } from './app-routing.module';
import { ServiceModule } from './services/service.module';
import { environment } from 'src/environments/environment';

// Import Pages.
import { AppComponent } from './app.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserLoginPageComponent } from './pages/user-login-page/user-login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NotAuthenticatedPageComponent } from './pages/not-authenticated-page/not-authenticated-page.component';
import { DataPageComponent } from './pages/submission-pages/data-page/data-page.component';
import { OverviewPageComponent } from './pages/submission-pages/overview-page/overview-page.component';
import { SubmitPageComponent } from './pages/submission-pages/submit-page/submit-page.component';
import { ProjectPageComponent } from './pages/submission-pages/project-page/project-page.component';
import { SampleGroupPageComponent } from './pages/submission-pages/sample-group-page/sample-group-page.component';
import { MetadataPageComponent } from './pages/submission-pages/metadata-page/metadata-page.component';
import { ContactsPageComponent } from './pages/submission-pages/contacts-page/contacts-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { FAQPageComponent } from './pages/faq-page/faq-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { ProjectsPageComponent } from './pages/projects/projects.component';
import { ProjectCreatePageComponent } from './pages/projects/create/project-create-page.component';
import { UserTeamPageComponent } from './pages/user-team-page/user-team-page.component';
import { UserTeamCreatePageComponent } from './pages/user-team-create-page/user-team-create-page.component';

// Import Components.
import { EbiHeaderComponent } from './components/ebi-header/ebi-header.component';
import { EbiNavbarComponent } from './components/ebi-navbar/ebi-navbar.component';
import { EbiFooterComponent } from './components/ebi-footer/ebi-footer.component';
import { EbiSubmissionMenuComponent } from './components/ebi-submission-menu/ebi-submission-menu.component';

// Import Guards.
import { LoggedInGuard } from './guards/logged-in/logged-in.guard';

// Imports
import { NgxLoadingModule } from 'ngx-loading';
import { FileSizeModule } from 'ngx-filesize';

// Import Interceptors.
import { httpInterceptorProviders } from './http-interceptors/index';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { PublicationPageComponent } from './pages/submission-pages/publication-page/publication-page.component';

export function getToken(): string {
  return localStorage.getItem('jwt_token') || '';
}
export function updateToken(newToken: string): void {
  return localStorage.setItem('jwt_token', newToken);
}
// Optional
export function removeToken(): void {
  return localStorage.removeItem('jwt_token');
}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    NotAuthenticatedPageComponent,
    UserPageComponent,
    UserLoginPageComponent,
    UserTeamPageComponent,
    UserTeamCreatePageComponent,
    EbiHeaderComponent,
    EbiNavbarComponent,
    EbiFooterComponent,
    EbiSubmissionMenuComponent,
    DataPageComponent,
    ProjectPageComponent,
    SampleGroupPageComponent,
    MetadataPageComponent,
    ContactsPageComponent,
    OverviewPageComponent,
    SubmitPageComponent,
    DashboardPageComponent,
    FAQPageComponent,
    HelpPageComponent,
    ProjectsPageComponent,
    ProjectCreatePageComponent,
    YesNoPipe,
    PublicationPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgSelectModule,
    NgxSmartModalModule.forRoot(),
    AuthModule.forRoot({
      aapURL: environment.authenticationHost,
      tokenGetter: getToken,
      tokenUpdater: updateToken,
      tokenRemover: removeToken
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken
      }
    }),
    NgxLoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(0,0,0,0.6)',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    HttpClientModule,
    FileSizeModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      closeButton: true,
      maxOpened: 5,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    ServiceModule
  ],
  providers: [
    LoggedInGuard,
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

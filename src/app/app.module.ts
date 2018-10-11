import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AuthModule } from 'angular-aap-auth';
import { JwtModule } from '@auth0/angular-jwt';

import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment }  from 'src/environments/environment';

// Import Pages.
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserLoginPageComponent } from './pages/user-login-page/user-login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NotAuthenticatedPageComponent } from './pages/not-authenticated-page/not-authenticated-page.component';
import { DataPageComponent } from './pages/submission-pages/data-page/data-page.component';
import { OverviewPageComponent } from './pages/submission-pages/overview-page/overview-page.component';
import { SubmitPageComponent } from './pages/submission-pages/submit-page/submit-page.component';
import { ProjectPageComponent } from './pages/submission-pages/project-page/project-page.component';
import { ProtocolsPageComponent } from './pages/submission-pages/protocols-page/protocols-page.component';
import { SamplesPageComponent } from './pages/submission-pages/samples-page/samples-page.component';
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

// Import Guards.
import { LoggedInGuard } from './guards/logged-in/logged-in.guard';

// Imports
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

import { EndpointService } from './services/endpoint.service';

// Import Interceptors.
import { httpInterceptorProviders } from './http-interceptors/index';

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
    DataPageComponent,
    ProjectPageComponent,
    ProtocolsPageComponent,
    SamplesPageComponent,
    ContactsPageComponent,
    OverviewPageComponent,
    SubmitPageComponent,
    DashboardPageComponent,
    FAQPageComponent,
    HelpPageComponent,
    ProjectsPageComponent,
    ProjectCreatePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      aapURL: environment.authenticationHost,
      tokenGetter: getToken,
      tokenUpdater: updateToken,
      tokenRemover: removeToken
    }),
    JwtModule.forRoot({
      config: {
          tokenGetter: getToken,
      }
    }),
    LoadingModule.forRoot({
      backdropBackgroundColour: 'rgba(0,0,0,0.6)',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    HttpClientModule
  ],
  providers: [
    LoggedInGuard,
    EndpointService,
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

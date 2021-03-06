import { PublicationPageComponent } from './pages/submission-pages/publication-page/publication-page.component';
import { Routes } from '@angular/router';
// Import Pages.
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NotAuthenticatedPageComponent } from './pages/not-authenticated-page/not-authenticated-page.component';
import { ProjectsPageComponent } from './pages/projects/projects.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserLoginPageComponent } from './pages/user-login-page/user-login-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { FAQPageComponent } from './pages/faq-page/faq-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { DataPageComponent } from './pages/submission-pages/data-page/data-page.component';
import { ProjectPageComponent } from './pages/submission-pages/project-page/project-page.component';
import { SampleGroupPageComponent } from './pages/submission-pages/sample-group-page/sample-group-page.component';
import { MetadataPageComponent } from './pages/submission-pages/metadata-page/metadata-page.component';
import { ContactsPageComponent } from './pages/submission-pages/contacts-page/contacts-page.component';
import { OverviewPageComponent } from './pages/submission-pages/overview-page/overview-page.component';
import { SubmitPageComponent } from './pages/submission-pages/submit-page/submit-page.component';
import { ProjectCreatePageComponent } from './pages/projects/create/project-create-page.component';
import { UserTeamPageComponent } from './pages/user-team-page/user-team-page.component';

// Import Guards.
import { LoggedInGuard } from './guards/logged-in/logged-in.guard';
import { UserTeamCreatePageComponent } from './pages/user-team-create-page/user-team-create-page.component';

export const ROUTES: Routes = [
  { path: '', component: DashboardPageComponent, canActivate: [LoggedInGuard] },
  { path: 'home', component: DashboardPageComponent, canActivate: [LoggedInGuard] },
  { path: '403', component: NotAuthenticatedPageComponent },
  { path: 'projects', component: ProjectsPageComponent, canActivate: [LoggedInGuard] },
  { path: 'projects/create', component: ProjectCreatePageComponent, canActivate: [LoggedInGuard] },
  { path: 'user', component: UserPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission', redirectTo: 'submission/overview', pathMatch: 'full', canActivate: [LoggedInGuard] },
  { path: 'submission/overview', component: OverviewPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/project', component: ProjectPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/publications', component: PublicationPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/contacts', component: ContactsPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/data', component: DataPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/sample-group', component: SampleGroupPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/metadata/:id', component: MetadataPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/submit', component: SubmitPageComponent, canActivate: [LoggedInGuard] },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [LoggedInGuard] },
  { path: 'user/login', component: UserLoginPageComponent },
  { path: 'user/teams', component: UserTeamPageComponent, canActivate: [LoggedInGuard] },
  { path: 'user/teams/create', component: UserTeamCreatePageComponent, canActivate: [LoggedInGuard] },
  { path: 'faq', component: FAQPageComponent },
  { path: 'helpdesk', component: HelpPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

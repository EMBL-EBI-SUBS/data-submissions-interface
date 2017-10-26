import { Routes } from '@angular/router';
// Import Pages.
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserLoginPageComponent } from './pages/user-login-page/user-login-page.component';
import { UserLogoutPageComponent } from './pages/user-logout-page/user-logout-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { LibraryPageComponent } from './pages/library-page/library-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { DataPageComponent } from './pages/submission-pages/data-page/data-page.component';
import { ProjectPageComponent } from './pages/submission-pages/project-page/project-page.component';
import { TeamPageComponent } from './pages/submission-pages/team-page/team-page.component';
import { OverviewPageComponent } from './pages/submission-pages/overview-page/overview-page.component';
import { SubmitPageComponent } from './pages/submission-pages/submit-page/submit-page.component';

export const ROUTES: Routes = [
  { path: '',      component: HomePageComponent },
  { path: 'home',  component: HomePageComponent },
  { path: 'user',  component: UserPageComponent },
  { path: 'user/login',  component: UserLoginPageComponent },
  { path: 'user/logout',  component: UserLogoutPageComponent },
  { path: 'submission', redirectTo: 'submission/data', pathMatch: 'full'},
  { path: 'submission/data',    component: DataPageComponent },
  { path: 'submission/project',    component: ProjectPageComponent },
  { path: 'submission/team',    component: TeamPageComponent },
  { path: 'submission/overview',    component: OverviewPageComponent },
  { path: 'submission/submit',    component: SubmitPageComponent },
  { path: 'dashboard',  component: DashboardPageComponent },
  { path: 'library',  component: LibraryPageComponent },
  { path: 'help',  component: HelpPageComponent },
  { path: '**',    component: NotFoundPageComponent },
];

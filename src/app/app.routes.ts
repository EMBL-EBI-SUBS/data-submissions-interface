import { Routes } from '@angular/router';
// Import Pages.
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { NotAuthenticatedPageComponent } from './pages/not-authenticated-page/not-authenticated-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserLoginPageComponent } from './pages/user-login-page/user-login-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { LibraryPageComponent } from './pages/library-page/library-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { DataPageComponent } from './pages/submission-pages/data-page/data-page.component';
import { StudyPageComponent } from './pages/submission-pages/study-page/study-page.component';
import { ExperimentPageComponent } from './pages/submission-pages/experiment-page/experiment-page.component';
import { SamplesPageComponent } from './pages/submission-pages/samples-page/samples-page.component';
import { ContactsPageComponent } from './pages/submission-pages/contacts-page/contacts-page.component';
import { OverviewPageComponent } from './pages/submission-pages/overview-page/overview-page.component';
import { SubmitPageComponent } from './pages/submission-pages/submit-page/submit-page.component';

// Import Guards.
import { LoggedInGuard } from './guards/logged-in/logged-in.guard';

export const ROUTES: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: '403', component: NotAuthenticatedPageComponent },
  { path: 'user', component: UserPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission', redirectTo: 'submission/overview', pathMatch: 'full', canActivate: [LoggedInGuard] },
  { path: 'submission/overview', component: OverviewPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/study', component: StudyPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/data', component: DataPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/experiment', component: ExperimentPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/samples', component: SamplesPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/contacts', component: ContactsPageComponent, canActivate: [LoggedInGuard] },
  { path: 'submission/submit', component: SubmitPageComponent, canActivate: [LoggedInGuard] },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [LoggedInGuard] },
  { path: 'library', component: LibraryPageComponent, canActivate: [LoggedInGuard] },
  { path: 'help', component: HelpPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

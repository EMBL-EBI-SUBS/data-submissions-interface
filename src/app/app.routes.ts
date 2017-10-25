import { Routes } from '@angular/router';
// Import Pages.
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

export const ROUTES: Routes = [
  { path: '',      component: HomePageComponent },
  { path: 'home',  component: HomePageComponent },
  { path: '**',    component: NotFoundPageComponent },
];

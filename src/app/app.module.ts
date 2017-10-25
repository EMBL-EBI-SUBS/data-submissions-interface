import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Import Pages.
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

// Import Components.
import { EbiHeaderComponent } from './components/ebi-header/ebi-header.component';
import { EbiNavbarComponent } from './components/ebi-navbar/ebi-navbar.component';
import { EbiFooterComponent } from './components/ebi-footer/ebi-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotFoundPageComponent,
    EbiHeaderComponent,
    EbiNavbarComponent,
    EbiFooterComponent
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

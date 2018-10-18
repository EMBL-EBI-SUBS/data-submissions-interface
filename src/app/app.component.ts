import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: [ './app.component.scss' ],
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit() {
    jQuery(document).foundation();
    jQuery(document).foundationExtendEBI();
  }
}

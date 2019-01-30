import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  constructor(private titleService: Title) { }

  ngAfterViewInit() {
    this.titleService.setTitle('Data Submission Service');
    jQuery(document).foundation();
    jQuery(document).foundationExtendEBI();
  }
}

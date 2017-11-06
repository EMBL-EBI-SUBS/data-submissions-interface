import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $;

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {
  userHasTeam = true;
  token: string;
  tabLinks: any = [
    {"title": "Overview", "href": "/submission/overview"},
    {"title": "Study", "href": "/submission/study"},
    {"title": "Data", "href": "/submission/data"},
    {"title": "Experiment", "href": "/submission/experiment"},
    {"title": "Samples", "href": "/submission/samples"},
    {"title": "Contacts", "href": "/submission/contacts"},
    {"title": "Submit", "href": "/submission/submit"},
  ];
  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    $("#main-content-area").foundation();
  }
}

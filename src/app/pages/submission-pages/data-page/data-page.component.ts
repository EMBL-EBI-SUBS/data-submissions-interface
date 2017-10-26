import { Component, OnInit } from '@angular/core';

declare var $;

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {
  tabLinks: any = [
    {"title": "Data", "href": "/submission/data"},
    {"title": "Project", "href": "/submission/project"},
    {"title": "Team", "href": "/submission/team"},
    {"title": "Overview", "href": "/submission/overview"},
    {"title": "Submit", "href": "/submission/submit"},
  ];
  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    $("#main-content-area").foundation();
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss']
})
export class OverviewPageComponent implements OnInit {
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

}

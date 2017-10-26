import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.scss']
})
export class TeamPageComponent implements OnInit {
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

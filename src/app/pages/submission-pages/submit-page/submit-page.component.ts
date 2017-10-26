import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-submit-page',
  templateUrl: './submit-page.component.html',
  styleUrls: ['./submit-page.component.scss']
})
export class SubmitPageComponent implements OnInit {
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

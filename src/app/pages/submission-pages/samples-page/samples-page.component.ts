import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-samples-page',
  templateUrl: './samples-page.component.html',
  styleUrls: ['./samples-page.component.scss']
})
export class SamplesPageComponent implements OnInit {
  tabLinks: any = [
    {"title": "Overview", "href": "/submission/overview"},
    {"title": "Study", "href": "/submission/study"},
    {"title": "Data", "href": "/submission/data"},
    {"title": "Experiment", "href": "/submission/experiment"},
    {"title": "Samples", "href": "/submission/samples"},
    {"title": "Contacts", "href": "/submission/contacts"},
    {"title": "Submit", "href": "/submission/submit"},
  ];
  
  constructor() { }

  ngOnInit() {
  }

}

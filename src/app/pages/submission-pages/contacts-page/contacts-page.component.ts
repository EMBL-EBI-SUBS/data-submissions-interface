import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})
export class ContactsPageComponent implements OnInit {
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

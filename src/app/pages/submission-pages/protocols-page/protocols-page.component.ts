import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-protocols-page',
  templateUrl: './protocols-page.component.html',
  styleUrls: ['./protocols-page.component.scss']
})
export class ProtocolsPageComponent implements OnInit {
  tabLinks: any = [
    {"title": "Overview", "href": "/submission/overview"},
    {"title": "Project", "href": "/submission/project"},
    {"title": "Data", "href": "/submission/data"},
    {"title": "Samples", "href": "/submission/samples"},
    {"title": "Protocols", "href": "/submission/protocols"},
    {"title": "Contacts", "href": "/submission/contacts"},
    {"title": "Submit", "href": "/submission/submit"},
  ];
  
  constructor() { }

  ngOnInit() {
  }

}

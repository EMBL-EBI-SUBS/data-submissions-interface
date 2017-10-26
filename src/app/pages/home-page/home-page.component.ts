import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  headerMainMenu = [
    {"title": "Data", "href": "data"},
    {"title": "Project", "href": "project"},
    {"title": "Team", "href": "team"},
    {"title": "Overview", "href": "overview"},
    {"title": "Submit", "href": "submit"},
  ];
  constructor() { }

  ngOnInit() {
  }

}

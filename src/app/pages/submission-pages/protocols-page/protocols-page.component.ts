import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-protocols-page',
  templateUrl: './protocols-page.component.html',
  styleUrls: ['./protocols-page.component.scss']
})
export class ProtocolsPageComponent implements OnInit {
  tabLinks: any = [
    { 'title': 'Overview', 'href': '/submission/overview' },
    { 'title': 'Project', 'href': '/submission/project' },
    { 'title': 'Data', 'href': '/submission/data' },
    { 'title': 'Samples', 'href': '/submission/samples' },
    { 'title': 'Protocols', 'href': '/submission/protocols' },
    { 'title': 'Contacts', 'href': '/submission/contacts' },
    { 'title': 'Submit', 'href': '/submission/submit' },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  /**
 * On Save and Exit.
 */
  onSaveExit() {
    this.router.navigate(['/']);
  }

  /**
    * On Save and continue.
    */
  onSaveContinue() {
    this.router.navigate(['/submission/contacts']);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ebi-submission-menu',
  templateUrl: './ebi-submission-menu.component.html',
  styleUrls: ['./ebi-submission-menu.component.scss'],
})
export class EbiSubmissionMenuComponent implements OnInit {
  @Input() submission: Object;

  tabLinks = [
    {'title': 'Overview', 'href': '/submission/overview'},
    {'title': 'Project', 'href': '/submission/project'},
    {'title': 'Contacts', 'href': '/submission/contacts'},
    {'title': 'Data', 'href': '/submission/data'},
    {'title': 'Submit', 'href': '/submission/submit'},
  ];

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.updateDataTypeLinks(this.submission);
  }

  /**
   * Alter menu links and add submission DataTypes as links.
   */
  updateDataTypeLinks(submission) {
    // Do nothing if dataType not yet exists in the submission.
    try {
      if (!submission['_links']['contents']['dataTypes']) {
        return;
      }
    } catch(e) {
      return;
    }

    for(let dataType of submission['_links']['contents']['dataTypes']) {
      let dataTypeMenuItem =  {'title': dataType.displayNamePlural, 'href': '/submission/metadata/' + dataType.id};
      this.tabLinks.splice(4, 0, dataTypeMenuItem);
    }
  }

  isTabsDisabled() {
    if (!this.submission) {
      return true;
    }

    return false;
  }
}

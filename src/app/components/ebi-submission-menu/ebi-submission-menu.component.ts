import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubmissionsService } from '../../services/submissions.service';

export class TabLinks {
  title: string
  href: string

  constructor (title: string, href: string) {
    this.title = title
    this.href = href
  }
}

@Component({
  selector: 'ebi-submission-menu',
  templateUrl: './ebi-submission-menu.component.html',
  styleUrls: ['./ebi-submission-menu.component.scss'],
})
export class EbiSubmissionMenuComponent implements OnInit {
  @Input() activeSubmission: Object;
  isTabsDisabled = false;

  tabLinks: TabLinks[] = [
    new TabLinks('Overview', '/submission/overview'),
    new TabLinks('Project', '/submission/project'),
    new TabLinks('Contacts', '/submission/contacts'),
    new TabLinks('Data', '/submission/data'),
    new TabLinks('Submit', '/submission/submit'),
  ];

  constructor(
    private router: Router,
    private submissionsService: SubmissionsService
  ) {
  }

  ngOnInit(): void {
    this.updateDataTypeLinks(this.activeSubmission);

    if (!this.activeSubmission) {
      this.isTabsDisabled = true;
    }
  }

  /**
   * Alter menu links and add submission DataTypes as links.
   */
  updateDataTypeLinks(submission): void {
    // Do nothing if dataType not yet exists in the submission.
    try {
      if (!submission['_links']['contents']['dataTypes']) {
        this.getSubmissionContents(submission);
        return;
      }
    } catch (e) {
      return;
    }

    for (const dataType of submission['_links']['contents']['dataTypes']) {
      this.tabLinks.splice(4, 0, new TabLinks(dataType.displayNamePlural, '/submission/metadata/' + dataType.id));
    }
  }

  /**
   * Get Submission Content.
   */
  getSubmissionContents(submission: any) {
    const submissionLinksRequestUrl = submission._links.contents.href;
    this.submissionsService.get(submissionLinksRequestUrl).subscribe (
      (data) => {
        submission['_links']['contents']['_links'] = data['_links'];
        submission['_links']['contents']['dataTypes'] = data['dataTypes'];
        this.submissionsService.setActiveSubmission(submission);
        this.activeSubmission = submission;
        this.updateDataTypeLinks(submission);
       },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }
}

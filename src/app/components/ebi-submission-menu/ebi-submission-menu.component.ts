import { Component, Input, OnInit } from '@angular/core';
import { SubmissionsService } from '../../services/submissions.service';

interface TabLinks {
  title: string;
  href: string;
}

interface DataType {
  id: string;
  displayNamePlural: string;
}

interface Submission {
  _links: {
    contents: {
      href: string;
      _links: Object;
      dataTypes?: DataType[]
    }
  };
}

@Component({
  selector: 'ebi-submission-menu',
  templateUrl: './ebi-submission-menu.component.html',
  styleUrls: ['./ebi-submission-menu.component.scss'],
})
export class EbiSubmissionMenuComponent implements OnInit {
  @Input()
  activeSubmission: Submission | undefined;

  public isTabsDisabled = true;

  public tabLinks: TabLinks[] = [
    {title: 'Overview', href: '/submission/overview'},
    {title: 'Project', href: '/submission/project'},
    {title: 'Contacts', href: '/submission/contacts'},
    {title: 'Data', href: '/submission/data'},
    {title: 'Submit', href: '/submission/submit'},
  ];

  constructor(
    private _submissionsService: SubmissionsService
  ) {
  }

  ngOnInit(): void {
    if (this.activeSubmission) {
      this.isTabsDisabled = false;

      const dataTypes = this.activeSubmission._links.contents.dataTypes; // undefined | DataType[]

      if (dataTypes === undefined) {
        this.getSubmissionContents();
      } else {
        this.updateDataTypeLinks(dataTypes);
      }
    }
  }

  /**
   * Alter menu links and add submission DataTypes as links.
   */
  updateDataTypeLinks(dataTypes: DataType[]): void {
    for (const dataType of dataTypes) {
      this.tabLinks.splice(4, 0, {title: dataType.displayNamePlural, href: `/submission/metadata/${dataType.id}`});
    }
  }

  /**
   * Get Submission Content.
   */
  getSubmissionContents(): void {
    const submissionLinksRequestUrl = this.activeSubmission._links.contents.href;
    this._submissionsService.get(submissionLinksRequestUrl).subscribe (
      data => {
        this.activeSubmission._links.contents._links = data['_links'];
        this.activeSubmission._links.contents.dataTypes = data['dataTypes'];
        this.updateDataTypeLinks(data['dataTypes']);
        this._submissionsService.setActiveSubmission(this.activeSubmission);
       }
    );
  }
}

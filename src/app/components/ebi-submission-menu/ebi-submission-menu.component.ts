import { PageService } from './../../services/page.service';
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
  selector: 'app-ebi-submission-menu',
  templateUrl: './ebi-submission-menu.component.html',
  styleUrls: ['./ebi-submission-menu.component.scss'],
})
export class EbiSubmissionMenuComponent implements OnInit {
  @Input()
  activeSubmission: Submission | undefined;

  public isTabsDisabled = true;

  public tabLinks: TabLinks[] = [
    { title: 'Overview', href: '/submission/overview' },
    { title: 'Project', href: '/submission/project' },
    { title: 'Publications', href: '/submission/publications' },
    { title: 'Contacts', href: '/submission/contacts' },
    { title: 'Sample Group', href: '/submission/sample-group' },
  ];

  constructor(
    private submissionsService: SubmissionsService,
    private pageService: PageService
  ) {}

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

  addSubmitLink(viewOnly: boolean) {
    if (viewOnly !== undefined && !viewOnly) {
      const submitLink = { title: 'Submit', href: '/submission/submit' };
      if (this.tabLinks.indexOf(submitLink) === -1) {
        this.tabLinks.push(submitLink);
      }
    }
  }


  /**
   * Alter menu links and add submission DataTypes as links.
   */
  updateDataTypeLinks(dataTypes: DataType[]): void {
    let filesTabNeeded = false;
    let fileDataType;
    for (const dataType of dataTypes) {
      if (dataType.id === 'files') {
        filesTabNeeded = true;
        fileDataType = dataType;
      } else if (dataType.id !== 'projects') {
        this.tabLinks.splice(this.tabLinks.length, 0,
          { title: dataType.displayNamePlural, href: `/submission/metadata/${dataType.id}` }
        );
      }
    }

    if (filesTabNeeded) {
      this.tabLinks.splice(this.tabLinks.length, 0,
        { title: fileDataType.displayNamePlural, href: `/submission/data` }
      );
    }

    this.addSubmitLink(this.pageService.setSubmissionViewMode(this.activeSubmission._links['submissionStatus'].href));
  }

  /**
   * Get Submission Content.
   */
  getSubmissionContents(): void {
    const submissionLinksRequestUrl = this.activeSubmission._links.contents.href;
    this.submissionsService.get(submissionLinksRequestUrl).subscribe(
      data => {
        this.activeSubmission._links.contents._links = data['_links'];
        this.activeSubmission._links.contents.dataTypes = data['dataTypes'];
        this.updateDataTypeLinks(data['dataTypes']);
        this.submissionsService.setActiveSubmission(this.activeSubmission);
      }
    );
  }
}

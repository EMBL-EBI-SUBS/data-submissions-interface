import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Import Services.
import { SubmissionsService } from 'src/app/services/submissions.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-submit-page',
  templateUrl: './submit-page.component.html',
  styleUrls: ['./submit-page.component.scss'],
})
export class SubmitPageComponent implements OnInit {
  token: string;
  activeSubmission: any;
  files: any;
  filesNotReadyToSubmitCount = 0;
  validationIssuesPerDataTypeId = [];
  totalMetadataBlockers: number;
  submissionIsEmpty: boolean;
  anyPendingValidationResult: boolean;

  constructor(
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    this.getSubmissionBlockersSummary();
  }

  getSubmissionBlockersSummary() {
    const submissionBlockersSummaryLink = this.activeSubmission['_links']['submissionBlockersSummary']['href'];

    this.requestsService.get(submissionBlockersSummaryLink).subscribe(
      (response) => {
        this.filesNotReadyToSubmitCount = response['notReadyFileCount'];
        this.totalMetadataBlockers = response['totalMetadataBlockers'];
        this.submissionIsEmpty = response['emptySubmission'];
        this.anyPendingValidationResult = response['anyPendingValidationResult'];

        const blockerEntityTypes = Object.keys(response['validationIssuesPerDataTypeId']);

        blockerEntityTypes.forEach(entityType => {
          this.validationIssuesPerDataTypeId.push(
              response['validationIssuesPerDataTypeId'][entityType]);
        });
      }
    );
  }

  hasBlockers(): boolean {
    return !(this.filesNotReadyToSubmitCount === 0
        && this.totalMetadataBlockers === 0
        && this.submissionIsEmpty === false
        && this.anyPendingValidationResult === false);
  }

  getSubmissionIssuesSummary() {
    this.submissionsService.getSubmissionIssuesSummary().subscribe(
      (response) => {
        this.filesNotReadyToSubmitCount = response['notReadyFileCount'];
        this.validationIssuesPerDataTypeId = response['validationIssuesPerDataTypeId'];
        this.submissionIsEmpty =  response['emptySubmission'];
        this.anyPendingValidationResult = response['anyPendingValidationResult'];
      }
    );
  }

  onSubmitSubmission() {
    const activeSubmissionUpdateEndpoint = this.activeSubmission._links.submissionStatus.href;
    const updateObj = {
      'status': 'Submitted',
    };
    this.requestsService.update(activeSubmissionUpdateEndpoint, updateObj).subscribe(
      (data) => {
        // If updating status successfully done. redirect to dashboard.
        this.submissionsService.deleteActiveSubmission();
        this.router.navigate(['/']);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }
}

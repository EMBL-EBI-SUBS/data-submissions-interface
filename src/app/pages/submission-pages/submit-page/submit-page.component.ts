import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FileStatus } from 'src/app/models/FileStatus';

// Import Services.
import { SubmissionsService } from 'src/app/services/submissions.service';
import { RequestsService } from 'src/app/services/requests.service';
import { FileService } from 'src/app/services/file.service';

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
  validationIssuesPerDataTypeId = {};
  totalMetadataBlockers: number;
  submissionIsEmpty: boolean;
  anyPendingValidationResult: boolean;

  constructor(
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private fileService: FileService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    this.getSubmissionBlockersSummary();
  }

  getSubmissionBlockersSummary() {
    // this.fileService.getActiveSubmissionsFiles(this.activeSubmission).subscribe(
    //   (response) => {
    //     this.files = response['_embedded']['files'];
    //     // format the file status string and store it as status_label for display
    //     this.files.forEach(file => {
    //       if (file.status !== FileStatus.READY_FOR_ARCHIVE) {
    //         this.filesNotReadyToSubmitCount++;
    //       }
    //     });
    //   }
    // )
    this.filesNotReadyToSubmitCount = 4;
    this.validationIssuesPerDataTypeId = {
      'samples':
        {
          'displayName': 'samples',
          'count': 2
        },
      'projects':
        {
          'displayName': 'ENA studies',
          'count': 1
        }
    };
    this.totalMetadataBlockers = 0;
    this.submissionIsEmpty = false;
    this.anyPendingValidationResult = false;

  }

  hasBlockers(): boolean {
    if (this.filesNotReadyToSubmitCount === 0
        && this.totalMetadataBlockers === 0
        && this.submissionIsEmpty === false
        && this.anyPendingValidationResult === false
      ) {
        return false;
      }

    return true;
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

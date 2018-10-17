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
  providers: [
    SubmissionsService,
    RequestsService,
    FileService
  ]
})
export class SubmitPageComponent implements OnInit {
  token: string;
  activeSubmission: any;
  files: any;
  filesNotReadyToSubmitCount = 0;

  constructor(
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private fileService: FileService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    this.getFileStatusInformation();
  }

  getFileStatusInformation() {
    this.fileService.getActiveSubmissionsFiles(this.activeSubmission).subscribe(
      (response) => {
        this.files = response['_embedded']['files'];
        // format the file status string and store it as status_label for display
        this.files.forEach(file => {
          if (file.status !== FileStatus.READY_FOR_ARCHIVE) {
            this.filesNotReadyToSubmitCount++;
          }
        });
      }
    )
  }

  onSubmitSubmission() {
    const activeSubmissionUpdateEndpoint = this.activeSubmission._links.submissionStatus.href;
    const updateObj = {
      'status' : 'Submitted',
    }
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

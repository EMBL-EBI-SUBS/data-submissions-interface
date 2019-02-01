import { SubmissionsService } from './submissions.service';
import { SubmissionStatus } from 'src/app/models/submission-status';
import { Injectable } from '@angular/core';

@Injectable()
export class PageService {

  constructor(private submissionService: SubmissionsService) {}

  setSubmissionViewMode(submissionStatusHref: string): boolean {
    const currentSubmissionStatus = this.submissionService.getStoredSubmissionStatus();
    if ( currentSubmissionStatus === null) {
      this.submissionService.getStatus(submissionStatusHref).subscribe(
        (submissionStatus) => {
          this.submissionService.setStoredSubmissionstatus(submissionStatus);
          return this.checkReadOnly(submissionStatus);
        }
      );
    } else {
      return this.checkReadOnly(currentSubmissionStatus);
    }
  }

  checkReadOnly(submissionStatus) {
    if (!SubmissionStatus.isEditableStatus(submissionStatus)) {
        return true;
    }

    return false;
  }
}

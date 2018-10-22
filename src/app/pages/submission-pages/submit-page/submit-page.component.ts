import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-submit-page',
  templateUrl: './submit-page.component.html',
  styleUrls: ['./submit-page.component.scss'],
})
export class SubmitPageComponent implements OnInit {
  token: string;
  activeSubmission: any;

  constructor(
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();
  }

  onSubmitSubmission() {
    let activeSubmissionUpdateEndpoint = this.activeSubmission._links.submissionStatus.href;
    let updateObj = {
      "status" : "Submitted",
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-submit-page',
  templateUrl: './submit-page.component.html',
  styleUrls: ['./submit-page.component.scss'],
  providers: [
    TokenService,
    SubmissionsService,
    RequestsService
  ]
})
export class SubmitPageComponent implements OnInit {
  token: string;
  activeSubmission: any;

  tabLinks: any = [
    {"title": "Overview", "href": "/submission/overview"},
    {"title": "Project", "href": "/submission/project"},
    {"title": "Data", "href": "/submission/data"},
    {"title": "Samples", "href": "/submission/samples"},
    {"title": "Protocols", "href": "/submission/protocols"},
    {"title": "Contacts", "href": "/submission/contacts"},
    {"title": "Submit", "href": "/submission/submit"},
  ];
  constructor(
    private tokenService: TokenService,
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    this.activeSubmission = this.submissionsService.getActiveSubmission();
  }

  onSubmitSubmission() {
    let activeSubmissionUpdateEndpoint = this.activeSubmission._links.submissionStatus.href;
    let updateObj = {
      "status" : "Submitted",
    }
    this.requestsService.update(this.token, activeSubmissionUpdateEndpoint, updateObj).subscribe(
      (data) => {
        // If updating status successfully done. redirect to dashboard.
        this.submissionsService.deleteActiveSubmission();
        this.router.navigate(['/dashboard']);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }
}

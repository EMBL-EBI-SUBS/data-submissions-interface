import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { TeamsService } from '../../../services/teams.service';
import { SubmissionsService } from '../../../services/submissions.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
  providers: [
    TeamsService,
    SubmissionsService,
    TokenService
  ]
})
export class OverviewPageComponent implements OnInit {
  overviewForm : FormGroup;
  token: string;
  submission: any;
  activeTeam : any;
  teams = [];
  userHasTeam = true;
  processStep = 1;

  tabLinks: any = [
    {"title": "Overview", "href": "/submission/overview"},
    {"title": "Study", "href": "/submission/study"},
    {"title": "Data", "href": "/submission/data"},
    {"title": "Experiment", "href": "/submission/experiment"},
    {"title": "Samples", "href": "/submission/samples"},
    {"title": "Contacts", "href": "/submission/contacts"},
    {"title": "Submit", "href": "/submission/submit"},
  ];
  constructor(
    private teamService: TeamsService,
    private submissionsService: SubmissionsService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    this.overviewForm = new FormGroup({
        team: new FormControl(),
        human: new FormControl(),
        controlled: new FormControl(),
    });
    // Make Sure User has a team and if user has a team, get the team list.
    this.teamService.list(this.token).subscribe (
      (data) => {
        // If user has no team assigned to it.
        if (!data.hasOwnProperty('_embedded')) {
          this.userHasTeam = false;
        }

        this.teams = data._embedded.teams;
        this.activeTeam = this.teams[0];
        // Create new submission.
        this.getActiveSubmission();
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  /**
   * On Save and Exit.
   */
  onSaveExit() {
    // TODO: Save the data.
    this.submissionsService.deleteActiveSubmission();
    this.router.navigate(["/home"]);
  }

  /**
   * On Save and continue.
   */
  onSaveContinue() {
    // TODO: Save the data.
    this.router.navigate(["/submission/study"]);
  }

  /**
   * Return true when form is ready to submit.
   */
  onReady() {
    if (this.overviewForm.value.human == 0) {
      return true;
    }
    else if (this.overviewForm.value.human == 1 && this.overviewForm.value.controlled) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Create new submissions.
   */
  getActiveSubmission() {
    // If Submission Already created before then return it.
    let getActiveSubmission = this.submissionsService.getActiveSubmission();
    if(getActiveSubmission) {
      return getActiveSubmission;
    }
    // If there is no submission then create a new one.
    let createSubmissionUrl = this.activeTeam._links['submissions:create'].href;
    this.submissionsService.create(this.token, createSubmissionUrl).subscribe (
      (data) => {
        // Store active submission in a local variable.
        this.submission = data;
        this.submissionsService.setActiveSubmission(this.submission);
        // Get Submission Content.
        this.getSubmissionContents(this.submission);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }


  /**
   * Get Submission Content.
   */
   getSubmissionContents(submission: any) {
     let submissionLinksRequestUrl = submission._links.contents.href;
     this.submissionsService.get(this.token, submissionLinksRequestUrl).subscribe (
       (data) => {
         submission._links.contents['_links'] = data._links;
         this.submissionsService.setActiveSubmission(submission);
       },
       (err) => {
         // TODO: Handle Errors.
         console.log(err);
       }
     );
   }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { UserService } from '../../../services/user.service';
import { TeamsService } from '../../../services/teams.service';
import { SubmissionsService } from '../../../services/submissions.service';

declare var Choices;

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
  providers: [
    UserService,
    TeamsService,
    SubmissionsService,
    TokenService
  ]
})
export class OverviewPageComponent implements OnInit {
  overviewForm: FormGroup;
  token: string;
  activeSubmission: any;
  activeTeam: any;
  teams = [];

  tabLinks: any = [
    {'title': 'Overview', 'href': '/submission/overview'},
    {'title': 'Project', 'href': '/submission/project'},
    {'title': 'Data', 'href': '/submission/data'},
    {'title': 'Experiment', 'href': '/submission/experiment'},
    {'title': 'Samples', 'href': '/submission/samples'},
    {'title': 'Contacts', 'href': '/submission/contacts'},
    {'title': 'Submit', 'href': '/submission/submit'},
  ];
  constructor(
    private userService: UserService,
    private teamsService: TeamsService,
    private submissionsService: SubmissionsService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    this.overviewForm = new FormGroup({
        team: new FormControl('_none'),
        human: new FormControl(),
        dataType: new FormControl(),
        dataSubType: new FormControl(),
        controlled: new FormControl(),
    });
    // Load User Teams.
    this.getUserTeams();
    // Get Active Submmission if exist.
    this.setActiveSubmission();

  }

  /**
   * Initialize the Choices Plugin.
   */
  ngAfterViewInit() {
    const multipleCancelButton = new Choices('select.choices', {
      delimiter: ',',
      editItems: true,
      maxItemCount: 5,
      removeItemButton: true,
    });
  }

  /**
   * On Save and Exit.
   */
  onSaveExit() {
    // TODO: Save the data to existing submission.
    if(this.activeSubmission) {
      this.submissionsService.deleteActiveSubmission();
      this.router.navigate(['/dashboard']);
    }
    // Create new submission
    else {
      let createSubmissionUrl = this.activeTeam._links['submissions:create'].href;
      this.submissionsService.create(this.token, createSubmissionUrl).subscribe (
        (data) => {
          // TODO: store overview data in submission.
          this.router.navigate(['/dashboard']);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
       }
      );
    }
  }

  /**
   * On Save and continue.
   */
  onSaveContinue() {
    // TODO: Save the data to existing submission.
    if(this.activeSubmission) {

      this.router.navigate(['/submission/project']);
    }
    // Create new submission
    // Set it as active submission.
    else {
      let createSubmissionUrl = this.activeTeam._links['submissions:create'].href;
      this.submissionsService.create(this.token, createSubmissionUrl).subscribe (
        (data) => {
          // TODO: store overview data in submission.
          // Store active submission in a local variable.
          this.activeSubmission = data;
          this.submissionsService.setActiveSubmission(this.activeSubmission);
          // Get Submission Content.
          this.getSubmissionContents(this.activeSubmission);
          this.router.navigate(['/submission/project']);

        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    }
  }

  /**
   * Return true when form "Before you begin" part is Ready.
   */
  onPartOneReady() {
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
   * Return true when form "Data" part is Ready.
   */
  onPartTwoReady() {
    if (this.overviewForm.value.dataType && this.overviewForm.value.dataSubType && this.overviewForm.value.dataType.length > 0 && this.overviewForm.value.dataSubType.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Create new submissions.
   */
  setActiveSubmission() {
    // If Submission Already created before then return it.
    const getActiveSubmission = this.submissionsService.getActiveSubmission();
    if (getActiveSubmission) {
      this.activeSubmission = getActiveSubmission;
      // TODO: Set form default field values.
      this.overviewForm.controls['team'].setValue(getActiveSubmission.team.name);
      this.overviewForm.controls['team'].disable();
    }
  }

  /**
   * Get Submission Content.
   */
   getSubmissionContents(submission: any) {
     const submissionLinksRequestUrl = submission._links.contents.href;
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

  /**
   * Get User Teams.
   */
  getUserTeams() {
    this.userService.getUserTeams(this.token).subscribe (
      (data) => {
        // If user has no team assigned to it.
        if (!data.hasOwnProperty('_embedded')) {
          return false;
        }

        this.teams = data._embedded.teams;
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  /**
   * On Change / Select the team.
   * Set active team.
   */
  onSelectTeam() {
    // If Team Name Selected.
    if (this.overviewForm.value.team !== "_none") {
      this.teamsService.getTeam(this.token, this.overviewForm.value.team).subscribe (
        (data) => {
          this.activeTeam = data;
          this.teamsService.setActiveTeam(data);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    }
    console.log(this.overviewForm.value.team);
  }
}

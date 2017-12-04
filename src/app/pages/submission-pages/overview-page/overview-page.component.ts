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
  dataTypes= [];
  dataSubTypes= [];
  teams = [];

  tabLinks: any = [
    {'title': 'Overview', 'href': '/submission/overview'},
    {'title': 'Project', 'href': '/submission/project'},
    {'title': 'Data', 'href': '/submission/data'},
    {'title': 'Samples', 'href': '/submission/samples'},
    {'title': 'Protocols', 'href': '/submission/protocols'},
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
      human: new FormControl(),
      dataType: new FormControl(),
      dataSubType: new FormControl(),
      controlled: new FormControl(),
    });
    // Get Data Types.
    this.getDataTypes();
    // Load User Teams.
    this.getUserTeams();
    // Get Active Submmission if exist.
    this.setActiveSubmission();
  }

  /**
   * On Save and Exit.
   */
  onSaveExit() {
    // TODO: Save the data to existing submission.
    if(this.activeSubmission) {
      this.submissionsService.deleteActiveSubmission();
      this.submissionsService.deleteActiveProject();
      this.teamsService.deleteActiveTeam();

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
   * Retrieve list of data types.
   */
  getDataTypes() {
    this.submissionsService.getDataTypes(this.token).subscribe (
      (data) => {
        // If no data Types.
        if (!data.content.hasOwnProperty('Sequencing')) {
          return false;
        }

        for (let dataType of data.content.Sequencing) {
          this.dataTypes.push({
            value: dataType,
            label: dataType,
          });
        }

        let dataTypesSelect = new Choices('select[name="dataType"]', {
          delimiter: ',',
          editItems: false,
          maxItemCount: -1,
          removeItemButton: true,
          choices: this.dataTypes,
          items: this.dataTypes,
        });

          // If no data SubTypes.
        if (!data.content.hasOwnProperty('FunctionalGenomics')) {
            return false;
        }

        for (let dataSubType of data.content.FunctionalGenomics) {
          this.dataSubTypes.push({
            value: dataSubType,
            label: dataSubType,
          });
        }

        new Choices('select[name="dataSubType"]', {
          delimiter: ',',
          editItems: false,
          maxItemCount: -1,
          removeItemButton: true,
          choices: this.dataSubTypes,
          items: this.dataSubTypes,
        });

      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
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
    let getActiveSubmission = this.submissionsService.getActiveSubmission();

    if (getActiveSubmission) {
      this.activeSubmission = getActiveSubmission;
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
        // TODO: Currently we set the first team as default one. We have to change this later on.
        if (this.teams[0].name) {
          this.setActiveTeam(this.teams[0].name);
        }
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
  }

  /**
   * On Change / Select the team.
   * Set active team.
   */
  setActiveTeam(name) {
    this.teamsService.getTeam(this.token, name).subscribe (
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
}

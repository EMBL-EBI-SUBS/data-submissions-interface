import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { UserService } from '../../../services/user.service';
import { TeamsService } from '../../../services/teams.service';
import { SubmissionsService } from '../../../services/submissions.service';
import { RequestsService } from '../../../services/requests.service';


declare var Choices;

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
  providers: [
    UserService,
    TeamsService,
    SubmissionsService,
    RequestsService,
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
  dataTypeChoice;
  dataSubTypeChoice;

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
    private requestsService: RequestsService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    this.overviewForm = new FormGroup({
      human: new FormControl(null, Validators.required),
      controlled: new FormControl(null, Validators.required),
      dataType: new FormControl('', Validators.required),
      dataSubType: new FormControl('', Validators.required),
    });
    // Load User Teams.
    this.getUserTeams();
    // Get Active Submmission if exist.
    this.setActiveSubmission();
    // Set Form Default Value
    if(this.activeSubmission) {
      this.setFormDefaultValue();
    }
    // Get Data Types.
    this.getDataTypes();
  }

  /**
   * On Save and Exit.
   */
  onSaveExit() {
    let overviewData = {};
    overviewData['human'] = this.overviewForm.value.human;
    overviewData['controlled'] = this.overviewForm.value.controlled;
    overviewData['dataType'] = this.overviewForm.value.dataType;
    overviewData['dataSubType'] = this.overviewForm.value.dataSubType;

    let bodyData = {"uiData" : {
        "overview" : overviewData
    }};

    // TODO: Save the data to existing submission.
    if(this.activeSubmission) {
      let updateSubmissionUrl = this.activeSubmission._links['self:update'].href;
      this.requestsService.partialUpdate(this.token, updateSubmissionUrl, bodyData).subscribe(
          (data) => {
            // Save Updated Submission to the Session.
            this.submissionsService.deleteActiveSubmission();
            this.submissionsService.setActiveSubmission(data);
          },
          (err) => {
            console.log(err);
          }
      );

      this.submissionsService.deleteActiveSubmission();
      this.submissionsService.deleteActiveProject();
      this.teamsService.deleteActiveTeam();

      this.router.navigate(['/dashboard']);
    }
    // Create new submission
    else {
      let createSubmissionUrl = this.activeTeam._links['submissions:create'].href;
      this.submissionsService.create(this.token, createSubmissionUrl, bodyData).subscribe (
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
    let overviewData = {};
    overviewData['human'] = this.overviewForm.value.human;
    overviewData['controlled'] = this.overviewForm.value.controlled;
    overviewData['dataType'] = this.overviewForm.value.dataType;
    overviewData['dataSubType'] = this.overviewForm.value.dataSubType;

    let bodyData = {"uiData" : {
        "overview" : overviewData
    }};

    // If Submission Exist, Update Request.
    if(this.activeSubmission) {
      let updateSubmissionUrl = this.activeSubmission._links['self:update'].href;
      this.requestsService.partialUpdate(this.token, updateSubmissionUrl, bodyData).subscribe(
          (data) => {
            // Save Updated Submission to the Session.
            this.submissionsService.deleteActiveSubmission();
            this.submissionsService.setActiveSubmission(data);
          },
          (err) => {
            console.log(err);
          }
      );

      this.router.navigate(['/submission/project']);
    }
    // Create new submission
    // Set it as active submission.
    else {
      let createSubmissionUrl = this.activeTeam._links['submissions:create'].href;

      this.submissionsService.create(this.token, createSubmissionUrl, bodyData).subscribe (
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
   * Set Form Default Value.
   */
  setFormDefaultValue() {
    try {
      if(this.activeSubmission.uiData.overview) {
        this.overviewForm.patchValue({
          human:  this.activeSubmission.uiData.overview.human,
          controlled: this.activeSubmission.uiData.overview.controlled,
          dataType: this.activeSubmission.uiData.overview.dataType,
          dataSubType: this.activeSubmission.uiData.overview.dataSubType,
        });
      }
    }
    catch (e) {}
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
          let optionValue = {
            value: dataType,
            label: dataType,
          };

          // If Option Value Saved before then set it as default value.
          try {
            if (this.activeSubmission.uiData.overview.dataType.indexOf(dataType) !== -1) {
              optionValue['selected'] = true;
            }

          } catch (e) {}

          this.dataTypes.push(optionValue);
        }

        this.dataTypeChoice = new Choices('select[name="dataType"]', {
          delimiter: ',',
          editItems: true,
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
          let optionValue = {
            value: dataSubType,
            label: dataSubType,
          };

          // If Option Value Saved before then set it as default value.
          try {
            if (this.activeSubmission.uiData.overview.dataSubType.indexOf(dataSubType) !== -1) {
              optionValue['selected'] = true;
            }
          } catch (e) {}

          this.dataSubTypes.push(optionValue);
        }

        this.dataSubTypeChoice = new Choices('select[name="dataSubType"]', {
          delimiter: ',',
          editItems: true,
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

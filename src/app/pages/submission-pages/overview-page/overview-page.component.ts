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
  objectKeys = Object.keys;
  token: string;
  activeSubmission: any;
  activeTeam: any;
  dataTypes= [];
  selectedDataType: any;
  selectedDataSubType = [];
  savedDataType: any;
  savedDataSubType = [];
  savedHuman: string;
  savedControlled: string;
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
      dataSubType: new FormControl(''),
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
            this.setActiveSubmission();

            this.router.navigate(['/submission/project']);
          },
          (err) => {
            console.log(err);
          }
      );

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
        this.savedDataType  = this.activeSubmission.uiData.overview.dataType;
        this.savedDataSubType = this.activeSubmission.uiData.overview.dataSubType;
        this.savedHuman = this.activeSubmission.uiData.overview.human;
        this.savedControlled = this.activeSubmission.uiData.overview.controlled;

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
        this.dataTypes = data.content;
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

  isDataSubTypeSelected(dataSubTypeKey) {
    if(this.selectedDataSubType.indexOf(dataSubTypeKey) > -1) {
      return true;
    }

    return false;
  }

  onSelectDataType(event, dataType) {
    this.selectedDataSubType = [];
    this.selectedDataType = dataType;

    this.overviewForm.patchValue({
      dataType: this.selectedDataType,
      dataSubType: this.selectedDataSubType,
    });
  }

  onSelectSubDataType(event, dataSubType) {
    let itemIndex = this.selectedDataSubType.indexOf(dataSubType);

    if(itemIndex > -1) {
      this.selectedDataSubType.splice(itemIndex, 1);
    }
    else {
      this.selectedDataSubType.push(dataSubType);
    }

    this.overviewForm.patchValue({
      dataType: this.selectedDataType,
      dataSubType: this.selectedDataSubType,
    });
  }

  onChangeField(fieldName: string) {
    let message = "You might loss uploaded data and samples if you have changed this field value. Are you sure?";

    if(this.activeSubmission && !confirm(message)) {
      return;
    }

    if(fieldName == 'human') {
      delete this.savedHuman;
    }

    if(fieldName == 'controlled') {
      delete this.savedControlled;
    }

    if(fieldName == 'dataType') {
      this.selectedDataType = this.savedDataType;
      this.savedDataType = "";
      this.selectedDataSubType = this.savedDataSubType;
      this.savedDataSubType = [];
    }
  }

  onUpdateField(fieldName) {
    if(fieldName == "human") {
      this.savedHuman = this.overviewForm.value[fieldName];
    }

    if(fieldName == "controlled") {
      this.savedControlled = this.overviewForm.value[fieldName];
    }
  }
}

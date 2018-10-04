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
  submissionPlans= [];
  selectedSubmissionPlan: FormControl;
  savedSubmissionPlan: FormControl;
  savedHuman: string;
  savedControlled: string;
  savedGDPR: string;
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
      gdpr: new FormControl(null, Validators.required),
      submissionPlan: new FormControl('', Validators.required),
    });
    // Load User Teams.
    this.getUserTeams();
    // Get Active Submmission if exist.
    this.setActiveSubmission();
    // Set Form Default Value
    if (this.activeSubmission) {
      this.setFormDefaultValue();
    }
    // Get Submission Plans.
    this.getSubmissionPlans();
  }

  /**
   * On Save and Exit.
   */
  onSaveExit() {
    const bodyAndParam = this.createRequestBodyAndParams();
    const bodyData = bodyAndParam.body;
    const requestParam = bodyAndParam.requestparam;

    // TODO: Save the data to existing submission.
    if (this.activeSubmission) {
      const updateSubmissionUrl = this.activeSubmission._links['self:update'].href;
      this.requestsService.partialUpdate(this.token, updateSubmissionUrl, bodyData, requestParam).subscribe(
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
    } else {     // Create new submission
      const createSubmissionUrl = this.activeTeam._links['submissions:create'].href;
      this.submissionsService.create(this.token, createSubmissionUrl, bodyData, requestParam).subscribe (
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
    const bodyAndParam = this.createRequestBodyAndParams();
    const bodyData = bodyAndParam.body;
    const requestParam = bodyAndParam.requestparam;

    // If Submission Exist, Update Request.
    if (this.activeSubmission) {
      const updateSubmissionUrl = this.activeSubmission._links['self:update'].href;
      this.requestsService.partialUpdate(this.token, updateSubmissionUrl, bodyData, requestParam).subscribe(
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

    } else { // Create new submission. Set it as active submission.
      const createSubmissionUrl = this.activeTeam._links['submissions:create'].href;

      this.submissionsService.create(this.token, createSubmissionUrl, bodyData, requestParam).subscribe (
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
      if (this.activeSubmission.uiData.overview) {
        this.savedSubmissionPlan = this.activeSubmission.uiData.overview.submissionPlan;
        this.savedHuman = this.activeSubmission.uiData.overview.human;
        this.savedControlled = this.activeSubmission.uiData.overview.controlled;
        this.savedGDPR = this.activeSubmission.uiData.overview.gdpr;

        this.overviewForm.patchValue({
          human:  this.activeSubmission.uiData.overview.human,
          controlled: this.activeSubmission.uiData.overview.controlled,
          gdpr: this.activeSubmission.uiData.overview.gdpr,
          submissionPlan: this.activeSubmission.uiData.overview.submissionPlan,
        });
      }
    } catch (e) {}
  }

  /**
   * Retrieve list of submission plans.
   */
  getSubmissionPlans() {
    this.submissionsService.getSubmissionPlansResponse(this.token).subscribe (
      (data) => {
        this.submissionPlans = this.submissionsService.getSubmissionPlansUIData(data['_embedded'].submissionPlans);
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
    const getActiveSubmission = this.submissionsService.getActiveSubmission();

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
         submission._links.contents['_links'] = data['_links'];
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

        this.teams = data['_embedded']['teams'];
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

  onSelectSubmissionPlan(event, submissionPlan) {
    this.selectedSubmissionPlan = submissionPlan;

    this.overviewForm.patchValue({
      submissionPlan: this.selectedSubmissionPlan
    });
  }

  onChangeField(fieldName: string) {
    const message = 'You might loss uploaded data and samples if you have changed this field value. Are you sure?';

    if (this.activeSubmission && !confirm(message)) {
      return;
    }

    if (fieldName === 'human') {
      delete this.savedHuman;
    }

    if (fieldName === 'controlled') {
      delete this.savedControlled;
    }

    if(fieldName === 'gdpr'){
      delete this.savedGDPR;
    }
    
    if (fieldName === 'submissionPlan') {
      this.selectedSubmissionPlan = this.savedSubmissionPlan;
      this.savedSubmissionPlan = null;
    }
  }

  onUpdateField(fieldName) {
    if (fieldName === 'human') {
      this.savedHuman = this.overviewForm.value[fieldName];
    }

    if (fieldName === 'controlled') {
      this.savedControlled = this.overviewForm.value[fieldName];
    }

    if(fieldName == "gdpr") {
      this.savedGDPR = this.overviewForm.value[fieldName];
    }
  }

  isTabsDisabled() {
    if (!this.activeSubmission) {
      return true;
    }

    return false;
  }

  private createRequestBodyAndParams() {
    return {
      'body' : {
        'uiData' : {
          'overview' : {
            human: this.overviewForm.value.human,
            controlled: this.overviewForm.value.controlled,
            submissionPlan: this.overviewForm.value.submissionPlan,
          }
        }
      },
      'requestparam': {
        'submissionPlanId': this.overviewForm.value.submissionPlan.id
      }
    };
  }
}

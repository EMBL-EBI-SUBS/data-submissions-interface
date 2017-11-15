import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { UserService } from '../../../services/user.service';
import { RequestsService } from '../../../services/requests.service';


@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  providers: [
    SubmissionsService,
    UserService,
    RequestsService,
    TokenService
  ]
})
export class ProjectPageComponent implements OnInit {
  projectForm : FormGroup;
  activeSubmission: any;
  projects: any;
  token: string;

  tabLinks: any = [
    {"title": "Overview", "href": "/submission/overview"},
    {"title": "Project", "href": "/submission/project"},
    {"title": "Data", "href": "/submission/data"},
    {"title": "Experiment", "href": "/submission/experiment"},
    {"title": "Samples", "href": "/submission/samples"},
    {"title": "Contacts", "href": "/submission/contacts"},
    {"title": "Submit", "href": "/submission/submit"},
  ];

  constructor(
    private submissionsService: SubmissionsService,
    private userService: UserService,
    private requestsService: RequestsService,
    private tokenService: TokenService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    this.projectForm = new FormGroup({
      project: new FormControl('_create', Validators.required),
      projectTitle: new FormControl('', Validators.required),
      projectDescription: new FormControl('', Validators.required),
      projectShortName: new FormControl('', Validators.required),
      submissionShortName: new FormControl('', Validators.required),
      submissionPublication: new FormControl(''),
    });
    // Load list of projects.
    this.onLoadProjects();
    this.initializeForm();
  }


  /**
   * On Save and Exit.
   */
  onSaveExit() {
    // TODO: Save the data.
    let submissionProjectCreateUrl = this.activeSubmission._links.contents._links['projects:create'].href;
    let submissionProjectDataObject = {
      'alias': this.projectForm.value.projectShortName,
      'title': this.projectForm.value.projectTitle,
      'description': this.projectForm.value.projectDescription
    };

    let submissionUpdateUrl = this.activeSubmission._links['self:update'].href;
    let submissionUpdateData = this.activeSubmission;
    submissionUpdateData['name'] = this.projectForm.value.submissionShortName;
    submissionUpdateData['projectName'] = this.projectForm.value.projectShortName;

    // Create the project.
    //  TODO: Fix creating duplicated projects issue.
    this.requestsService.create(this.token, submissionProjectCreateUrl, submissionProjectDataObject).subscribe (
      (data) => {
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );

    // Update the submission.
    this.requestsService.update(this.token, submissionUpdateUrl, submissionUpdateData).subscribe (
      (data) => {
        this.router.navigate(["/dashboard"]);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );

    this.submissionsService.deleteActiveSubmission();
  }

  /**
   * On Save and continue.
   */
  onSaveContinue() {
    // TODO: Save the data.
    let submissionProjectCreateUrl = this.activeSubmission._links.contents._links['projects:create'].href;
    let submissionProjectDataObject = {
      'alias': this.projectForm.value.projectShortName,
      'title': this.projectForm.value.projectTitle,
      'description': this.projectForm.value.projectDescription
    };

    let submissionUpdateUrl = this.activeSubmission._links['self:update'].href;
    let submissionUpdateData = this.activeSubmission;
    submissionUpdateData['name'] = this.projectForm.value.submissionShortName;
    submissionUpdateData['projectName'] = this.projectForm.value.projectShortName;

    // Create the project.
    //  TODO: Fix creating duplicated projects issue.
    this.requestsService.create(this.token, submissionProjectCreateUrl, submissionProjectDataObject).subscribe (
      (data) => {
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );

    // Update the submission.
    this.requestsService.update(this.token, submissionUpdateUrl, submissionUpdateData).subscribe (
      (data) => {
        this.submissionsService.setActiveSubmission(data);
        this.activeSubmission = data;
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );

    this.router.navigate(['/submission/data']);
  }

  /**
   * Return true when form is ready to submit.
   */
  onReady() {
    console.log(this.projectForm);
    // TODO: Add form validation.
    return this.projectForm.valid;
  }

  /**
   * Load list of projects for exisitng user.
   */
  onLoadProjects() {
    this.userService.getUserProjects(this.token).subscribe (
      (data) => {
        // TODO: Create a team if user has no tea m.
        // If user has no team assigned to it.
        if (!data.hasOwnProperty('_embedded')) {
          return false;
        }

        this.projects = data._embedded.projects;
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  /**
   * On Change projects list select.
   */
  onSelectProject() {
    // If Create a new project then disable select list.
    if(this.projectForm.value.project !== "_create") {
      this.projectForm.controls['projectTitle'].setValue(this.projects[this.projectForm.value.project].title);
      this.projectForm.controls['projectDescription'].setValue(this.projects[this.projectForm.value.project].description);
      this.projectForm.controls['projectShortName'].setValue(this.projects[this.projectForm.value.project].alias);
    }
    else {
      this.projectForm.controls['projectTitle'].setValue('');
      this.projectForm.controls['projectDescription'].setValue('');
      this.projectForm.controls['projectShortName'].setValue('');
    }
  }

  /**
   * This function set default value for forms and load submission content data.
   */
  initializeForm() {
    // Set Active Submission.
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    // Load Submission Content Actions.
    this.requestsService.get(this.token, this.activeSubmission._links.contents.href).subscribe (
      (data) => {
        this.activeSubmission._links.contents['_links'] = data._links;
        this.submissionsService.setActiveSubmission(this.activeSubmission);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
    if(this.activeSubmission) {
      // Update form fields.
      this.projectForm.controls['submissionShortName'].setValue(this.activeSubmission.name);
    }
  }
}

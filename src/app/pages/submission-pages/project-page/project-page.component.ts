import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { UserService } from '../../../services/user.service';
import { RequestsService } from '../../../services/requests.service';

declare var Choices;

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  providers: [
    SubmissionsService,
    TeamsService,
    UserService,
    RequestsService,
    TokenService
  ]
})
export class ProjectPageComponent implements OnInit {
  projectForm : FormGroup;
  activeSubmission: any;
  activeProject: any;
  projects: any;
  token: string;

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
    private submissionsService: SubmissionsService,
    private teamsService: TeamsService,
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
      projectDescription: new FormControl(''),
      projectShortName: new FormControl('', Validators.required),
      submissionShortName: new FormControl('', Validators.required),
      submissionPublication: new FormControl(''),
    });
    // Load list of projects.
    this.onLoadProjects();
    this.initializeForm();
    this.getActiveProject();
  }

  /**
   * On Save and Exit.
   */
  onSaveExit() {
    let submissionProjectDataObject = {
      'alias': this.projectForm.value.projectShortName,
      'title': this.projectForm.value.projectTitle,
      'description': this.projectForm.value.projectDescription
    };

    try {
      // Create new project.
      let submissionProjectUpdateUrl = this.activeSubmission._links.contents._links['projects:create'].href;
      this.requestsService.create(this.token, submissionProjectUpdateUrl, submissionProjectDataObject).subscribe (
        (data) => {
          this.submissionsService.setActiveProject(data);
        },
        (err) => {
          // TODO: Handle Errors.
        }
      );
    } catch (err) {
      // Update existing project.
      let submissionProjectUpdateUrl = this.activeProject._links['self:update'].href;
      this.requestsService.partialUpdate(this.token, submissionProjectUpdateUrl, submissionProjectDataObject).subscribe (
        (data) => {
          this.submissionsService.setActiveProject(data);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    }

    let submissionUpdateUrl = this.activeSubmission._links['self:update'].href;
    let submissionUpdateData = this.activeSubmission;
    submissionUpdateData['name'] = this.projectForm.value.submissionShortName;
    submissionUpdateData['projectName'] = this.projectForm.value.projectShortName;

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
    this.submissionsService.deleteActiveProject();
    this.teamsService.deleteActiveTeam();
  }

  /**
   * On Save and continue.
   */
  onSaveContinue() {
    let submissionProjectDataObject = {
      'alias': this.projectForm.value.projectShortName,
      'title': this.projectForm.value.projectTitle,
      'description': this.projectForm.value.projectDescription
    };

    try {
      // Create new project.
      let submissionProjectUpdateUrl = this.activeSubmission._links.contents._links['projects:create'].href;
      this.requestsService.create(this.token, submissionProjectUpdateUrl, submissionProjectDataObject).subscribe (
        (data) => {
          this.submissionsService.setActiveProject(data);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    } catch (err) {
      // Update existing project.
      let submissionProjectUpdateUrl = this.activeProject._links['self:update'].href;
      this.requestsService.partialUpdate(this.token, submissionProjectUpdateUrl, submissionProjectDataObject).subscribe (
        (data) => {
          this.submissionsService.setActiveProject(data);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    }

    let submissionUpdateUrl = this.activeSubmission._links['self:update'].href;
    let submissionUpdateData = this.activeSubmission;
    submissionUpdateData['name'] = this.projectForm.value.submissionShortName;
    submissionUpdateData['projectName'] = this.projectForm.value.projectShortName;

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

  getActiveProject() {
    this.activeProject = this.submissionsService.getActiveProject();

    // If there is no active project stored in session.
    if (!this.activeProject) {
      this.submissionsService.getActiveSubmissionProject(this.token).subscribe(
        (data) => {
          this.activeProject = data;
          this.updateProjectForm(this.activeProject.alias, this.activeProject.title, this.activeProject.description);
        },
        (error) =>  {
        }
      );
    }
    else {
      this.updateProjectForm(this.activeProject.alias, this.activeProject.title, this.activeProject.description);
    }
  }

  updateProjectForm(alias, title, description = "") {
    this.projectForm.controls['projectShortName'].setValue(alias);
    this.projectForm.controls['projectTitle'].setValue(title);
    this.projectForm.controls['projectDescription'].setValue(description);
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
      this.updateProjectForm(
        this.projects[this.projectForm.value.project].alias,
        this.projects[this.projectForm.value.project].title,
        this.projects[this.projectForm.value.project].description
      );
    }
    else {
      this.updateProjectForm('', '', '');
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

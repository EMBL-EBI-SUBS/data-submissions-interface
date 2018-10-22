import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { UserService } from '../../../services/user.service';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent implements OnInit {
  projectForm : FormGroup;
  activeSubmission: any;
  activeProject: any;
  projects: any;

  constructor(
    private submissionsService: SubmissionsService,
    private teamsService: TeamsService,
    private userService: UserService,
    private requestsService: RequestsService,
    private router: Router,
  ) { }

  ngOnInit() {
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
      this.requestsService.create(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe (
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
      this.requestsService.partialUpdate(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe (
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
    submissionUpdateData['uiData']['project'] = {
      'publication' : this.projectForm.value.submissionPublication
    };

    // Update the submission.
    this.requestsService.update(submissionUpdateUrl, submissionUpdateData).subscribe (
      (data) => {
        this.router.navigate(["/"]);
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
      this.requestsService.create(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe (
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
      this.requestsService.partialUpdate(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe (
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
    submissionUpdateData['uiData']['project'] = {
      'publication' : this.projectForm.value.submissionPublication
    };

    // Update the submission.
    this.requestsService.update(submissionUpdateUrl, submissionUpdateData).subscribe (
      (data) => {
        this.getSubmissionContents(data);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );

    this.router.navigate(['/submission/contacts']);
  }

  /**
   * Get Submission Content.
   */
  getSubmissionContents(submission: any) {
    const submissionLinksRequestUrl = submission._links.contents.href;
    this.submissionsService.get(submissionLinksRequestUrl).subscribe (
      (data) => {
        submission['_links']['contents']['_links'] = data['_links'];
        submission['_links']['contents']['dataTypes'] = data['dataTypes'];
        this.submissionsService.setActiveSubmission(submission);
        this.activeSubmission = submission;
       },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }


  getActiveProject() {
    this.activeProject = this.submissionsService.getActiveProject();

    // If there is no active project stored in session.
    if (!this.activeProject) {
      this.submissionsService.getActiveSubmissionProject().subscribe(
        (data) => {
          if(data) {
            this.activeProject = data;
            this.updateProjectForm(this.activeProject.alias, this.activeProject.title, this.activeProject.description);
          }

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
    this.userService.getUserProjects().subscribe (
      (data) => {
        // TODO: Create a team if user has no tea m.
        // If user has no team assigned to it.
        if (!data.hasOwnProperty('_embedded')) {
          return false;
        }

        this.projects = data['_embedded']['projects'];
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
    this.requestsService.get(this.activeSubmission._links.contents.href).subscribe (
      (data) => {
        this.activeSubmission['_links']['contents']['_links'] = data['_links'];
        this.activeSubmission['_links']['contents']['dataTypes'] = data['dataTypes'];
        this.submissionsService.setActiveSubmission(this.activeSubmission);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
    if(this.activeSubmission) {
      try {
        // Update form fields.
        this.projectForm.controls['submissionShortName'].setValue(this.activeSubmission.name);
        this.projectForm.controls['submissionPublication'].setValue(this.activeSubmission.uiData.project.publication);
      } catch (err) {

      }
    }
  }
}

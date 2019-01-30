import { PublicationStatus } from './../../../models/publication-status';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { UserService } from '../../../services/user.service';
import { RequestsService } from '../../../services/requests.service';
import { SubmissionStatus } from 'src/app/models/submission-status';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent implements OnInit {
  projectForm: FormGroup;
  activeSubmission: any;
  activeProject: any;
  projects: any;

  viewOnly = false;

  constructor(
    private submissionsService: SubmissionsService,
    private teamsService: TeamsService,
    private userService: UserService,
    private requestsService: RequestsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();

    // Load list of projects.
    this.onLoadProjects();
    this.getActiveProject();
  }

  // convenience getter for easy access to form fields
  get f() { return this.projectForm.controls; }

  /**
   * On Save and Exit.
   */
  onSaveExit() {
    const submissionProjectDataObject = {
      'alias': this.projectForm.value.projectShortName,
      'title': this.projectForm.value.projectTitle,
      'description': this.projectForm.value.projectDescription,
      'releaseDate': this.projectForm.value.releaseDate,
    };

    if (this.activeProject) {
      // Update existing project.
      const submissionProjectUpdateUrl = this.activeProject._links['self:update'].href;
      this.requestsService.partialUpdate(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe(
        (data) => {
          this.submissionsService.setActiveProject(data);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    } else {
      // Create new project.
      const submissionProjectUpdateUrl = this.activeSubmission._links.contents._links['projects:create'].href;
      this.requestsService.create(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe(
        (data) => {
          this.submissionsService.setActiveProject(data);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    }

    const submissionUpdateUrl = this.activeSubmission._links['self:update'].href;
    const submissionUpdateData = this.activeSubmission;
    submissionUpdateData['projectName'] = this.projectForm.value.projectShortName;

    // Update the submission.
    this.requestsService.update(submissionUpdateUrl, submissionUpdateData).subscribe(
      (data) => {
        this.router.navigate(['/']);
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
    const submissionProjectDataObject = {
      'alias': this.projectForm.value.projectShortName,
      'title': this.projectForm.value.projectTitle,
      'description': this.projectForm.value.projectDescription,
      'releaseDate': this.projectForm.value.releaseDate
    };

    if (this.activeProject) {
      // Update existing project.
      const submissionProjectUpdateUrl = this.activeProject._links['self:update'].href;
      this.requestsService.partialUpdate(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe(
        (data) => {
          this.submissionsService.setActiveProject(data);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    } else {
      // Create new project.
      const submissionProjectUpdateUrl = this.activeSubmission._links.contents._links['projects:create'].href;
      this.requestsService.create(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe(
        (data) => {
          this.submissionsService.setActiveProject(data);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    }

    const submissionUpdateUrl = this.activeSubmission._links['self:update'].href;
    const submissionUpdateData = this.activeSubmission;
    submissionUpdateData['projectName'] = this.projectForm.value.projectShortName;

    // Update the submission.
    this.requestsService.update(submissionUpdateUrl, submissionUpdateData).subscribe(
      (data) => {
        this.getSubmissionContents(data);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );

    this.router.navigate(['/submission/publications']);
  }

  /**
   * Get Submission Content.
   */
  getSubmissionContents(submission: any) {
    const submissionLinksRequestUrl = submission._links.contents.href;
    this.submissionsService.get(submissionLinksRequestUrl).subscribe(
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
          if (data) {
            this.activeProject = data;
            this.updateProjectForm(
              this.activeProject.alias,
              this.activeProject.title,
              this.activeProject.description,
              this.activeProject.releaseDate
            );
          }

        },
        (error) => {
        }
      );
    } else {
      this.updateProjectForm(
        this.activeProject.alias,
        this.activeProject.title,
        this.activeProject.description,
        this.activeProject.releaseDate
      );
    }
  }

  updateProjectForm(alias, title, description = '', releaseDate) {
    this.projectForm.controls['projectShortName'].setValue(alias);
    this.projectForm.controls['projectTitle'].setValue(title);
    this.projectForm.controls['projectDescription'].setValue(description);
    this.projectForm.controls['releaseDate'].setValue(releaseDate);
  }

  /**
   * Load list of projects for exisitng user.
   */
  onLoadProjects() {
    this.userService.getUserProjects().subscribe(
      (data) => {
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
    if (this.projectForm.value.project !== '_create') {
      this.updateProjectForm(
        this.projects[this.projectForm.value.project].alias,
        this.projects[this.projectForm.value.project].title,
        this.projects[this.projectForm.value.project].description,
        this.projects[this.projectForm.value.project].releaseDate
      );
    } else {
      this.updateProjectForm('', '', '', '');
    }
  }

  /**
   * This function set default value for forms and load submission content data.
   */
  initializeForm() {
    // Set Active Submission.
    this.activeSubmission = this.submissionsService.getActiveSubmission();

    // TODO getStatus make it more generic with Promise
    this.submissionsService.getStatus(this.activeSubmission._links.submissionStatus.href).subscribe(
      (submissionStatus) => {
        if (!SubmissionStatus.isEditableStatus(submissionStatus)) {
          this.viewOnly = true;
        }
      }
    );

    if (!this.viewOnly) {
      this.projectForm = this.formBuilder.group({
        project: ['_create'],
        projectTitle: ['', [Validators.required, Validators.minLength(50)]],
        projectDescription: ['', [Validators.required, Validators.minLength(50)]],
        projectShortName: ['', Validators.required],
        releaseDate: ['', [Validators.required]],
      });
    }

    // Load Submission Content Actions.
    this.requestsService.get(this.activeSubmission._links.contents.href).subscribe(
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
  }
}

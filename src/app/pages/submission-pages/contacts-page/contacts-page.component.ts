import { PageService } from './../../../services/page.service';
import { SubmissionStatus } from './../../../models/submission-status';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss'],
})
export class ContactsPageComponent implements OnInit {
  contactForm: FormGroup;
  activeSubmission: any;
  activeProject: any;

  viewOnly = false;

  constructor(
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private teamsService: TeamsService,
    private router: Router,
    private pageService: PageService
  ) { }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();

    this.viewOnly = this.pageService.setSubmissionViewMode(this.activeSubmission._links.submissionStatus.href);

    this.getActiveProject();

    this.contactForm = new FormGroup({
      orcid: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      middleInitials: new FormControl(''),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      affiliation: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      fax: new FormControl(''),
    });
  }

  onAddContact() {
    this.activeProject.contacts.push(this.contactForm.value);
    const projectUpdateUrl = this.activeProject._links['self:update'].href;
    this.requestsService.update(projectUpdateUrl, this.activeProject).subscribe(
      (project) => {
        this.submissionsService.setActiveProject(project);
      },
      (error) => {
        // TODO: Handle errors.
      }
    );
    this.contactForm.reset();
  }

  onCreateProject() {
    this.router.navigate(['submission/project']);
  }

  onDeleteContact(contactIndex: number) {
    this.activeProject.contacts.splice(contactIndex, 1);
    const projectUpdateUrl = this.activeProject._links['self:update'].href;
    this.requestsService.update(projectUpdateUrl, this.activeProject).subscribe(
      (project) => {
        this.submissionsService.setActiveProject(project);
      },
      (error) => {
        // TODO: Handle errors.
      }
    );
  }

  getActiveProject() {
    this.activeProject = this.submissionsService.getActiveProject();

    // If there is no active project stored in session.
    if (!this.activeProject && this.activeSubmission) {
      this.submissionsService.getActiveSubmissionProject().subscribe(
        (data) => {
          if (data) {
            this.activeProject = data;
          }
        },
        (error) => {

        }
      );
    }
  }

  onSaveExit() {
    this.submissionsService.deleteActiveSubmission();
    this.submissionsService.deleteActiveProject();
    this.teamsService.deleteActiveTeam();

    this.router.navigate(['/']);
  }

  onSaveContinue() {
    this.router.navigate(['/submission/data']);
  }

}

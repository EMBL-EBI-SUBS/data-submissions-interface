import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss'],
  providers: [
    SubmissionsService,
    TeamsService,
    RequestsService,
    TokenService
  ]
})
export class ContactsPageComponent implements OnInit {
  contactForm: FormGroup;
  activeSubmission: any;
  activeProject: any;
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
      private requestsService: RequestsService,
      private teamsService: TeamsService,
      private tokenService: TokenService,
      private router: Router,
  ) { }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    this.token = this.tokenService.getToken();
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
    let projectUpdateUrl = this.activeProject._links['self:update'].href;
    this.requestsService.update(this.token, projectUpdateUrl, this.activeProject).subscribe(
      (project) => {
        this.submissionsService.setActiveProject(project);
      },
      (error) => {
        // TODO: Handle errors.
      }
    );
    this.contactForm.reset();
  }

  onDeleteContact(contactIndex: number) {
    this.activeProject.contacts.splice(contactIndex, 1);
    let projectUpdateUrl = this.activeProject._links['self:update'].href;
    this.requestsService.update(this.token, projectUpdateUrl, this.activeProject).subscribe(
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
    if (!this.activeProject) {
      this.submissionsService.getActiveSubmissionProject(this.token).subscribe(
        (data) => {
          this.activeProject = data;
        },
        (error) =>  {

        }
      );
    }
  }

  onSaveExit() {
    this.submissionsService.deleteActiveSubmission();
    this.submissionsService.deleteActiveProject();
    this.teamsService.deleteActiveTeam();

    this.router.navigate(['/'])
  }

  onSaveContinue() {
    this.router.navigate(['/submission/submit'])
  }

}

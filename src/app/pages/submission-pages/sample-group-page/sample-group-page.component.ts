import { PageService } from './../../../services/page.service';
// import { PublicationStatus } from './../../../models/publication-status';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
// import { TeamsService } from '../../../services/teams.service';
// import { UserService } from '../../../services/user.service';
// import { RequestsService } from '../../../services/requests.service';
// import { SubmissionStatus } from 'src/app/models/submission-status';

@Component({
  selector: 'app-sample-group-page',
  templateUrl: './sample-group-page.component.html',
  styleUrls: ['./sample-group-page.component.scss'],
})
export class SampleGroupPageComponent implements OnInit {
  sampleGroupForm: FormGroup;
  // organizationForm: FormGroup;
  activeSubmission: any;
  activeSampleGroup: any;
  // projects: any;

  selectedIndex = -1;

  viewOnly = false;
  editMode = false;

  constructor(
    private submissionsService: SubmissionsService,
    // private teamsService: TeamsService,
    // private userService: UserService,
    // private requestsService: RequestsService,
    private pageService: PageService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();

    // // Load list of projects.
    // this.onLoadProjects();
     this.getActiveSampleGroup();
  }

  // convenience getter for easy access to form fields
  get f() { return this.sampleGroupForm.controls; }

  /**
   * On Save and Exit.
   */
  onSaveExit() {
    // const submissionProjectDataObject = {
    //   'alias': this.projectForm.value.projectShortName,
    //   'title': this.projectForm.value.projectTitle,
    //   'description': this.projectForm.value.projectDescription,
    //   'releaseDate': this.projectForm.value.releaseDate,
    // };

    // if (this.activeProject) {
    //   // Update existing project.
    //   const submissionProjectUpdateUrl = this.activeProject._links['self:update'].href;
    //   this.requestsService.partialUpdate(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe(
    //     (data) => {
    //       this.submissionsService.setActiveProject(data);
    //     },
    //     (err) => {
    //       // TODO: Handle Errors.
    //       console.log(err);
    //     }
    //   );
    // } else {
    //   // Create new project.
    //   const submissionProjectUpdateUrl = this.activeSubmission._links.contents._links['projects:create'].href;
    //   this.requestsService.create(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe(
    //     (data) => {
    //       this.submissionsService.setActiveProject(data);
    //     },
    //     (err) => {
    //       // TODO: Handle Errors.
    //       console.log(err);
    //     }
    //   );
    // }

    // const submissionUpdateUrl = this.activeSubmission._links['self:update'].href;
    // const submissionUpdateData = this.activeSubmission;
    // submissionUpdateData['projectName'] = this.projectForm.value.projectShortName;

    // // Update the submission.
    // this.requestsService.update(submissionUpdateUrl, submissionUpdateData).subscribe(
    //   (data) => {
    //     this.router.navigate(['/']);
    //   },
    //   (err) => {
    //     // TODO: Handle Errors.
    //     console.log(err);
    //   }
    // );

    // this.submissionsService.deleteActiveSubmission();
    // this.submissionsService.deleteActiveProject();
    // this.teamsService.deleteActiveTeam();
  }

  /**
   * On Save and continue.
   */
  onSaveContinue() {
    // const submissionProjectDataObject = {
    //   'alias': this.projectForm.value.projectShortName,
    //   'title': this.projectForm.value.projectTitle,
    //   'description': this.projectForm.value.projectDescription,
    //   'releaseDate': this.projectForm.value.releaseDate
    // };

    // if (this.activeProject) {
    //   // Update existing project.
    //   const submissionProjectUpdateUrl = this.activeProject._links['self:update'].href;
    //   this.requestsService.partialUpdate(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe(
    //     (data) => {
    //       this.submissionsService.setActiveProject(data);
    //       this.updateSubmissionContent();
    //       this.router.navigate(['/submission/publications']);
    //     },
    //     (err) => {
    //       // TODO: Handle Errors.
    //       console.log(err);
    //     }
    //   );
    // } else {
    //   // Create new project.
    //   const submissionProjectUpdateUrl = this.activeSubmission._links.contents._links['projects:create'].href;
    //   this.requestsService.create(submissionProjectUpdateUrl, submissionProjectDataObject).subscribe(
    //     (data) => {
    //       this.submissionsService.setActiveProject(data);
    //       this.updateSubmissionContent();
    //       this.router.navigate(['/submission/publications']);
    //     },
    //     (err) => {
    //       // TODO: Handle Errors.
    //       console.log(err);
    //     }
    //   );
    // }
  }

  /**
   * Get Submission Content.
   */
  getSubmissionContents(submission: any) {
    // const submissionLinksRequestUrl = submission._links.contents.href;
    // this.submissionsService.get(submissionLinksRequestUrl).subscribe(
    //   (data) => {
    //     submission['_links']['contents']['_links'] = data['_links'];
    //     submission['_links']['contents']['dataTypes'] = data['dataTypes'];
    //     this.submissionsService.setActiveSubmission(submission);
    //     this.activeSubmission = submission;
    //   },
    //   (err) => {
    //     // TODO: Handle Errors.
    //     console.log(err);
    //   }
    // );
  }

  getActiveSampleGroup() {
    // this.activeProject = this.submissionsService.getActiveProject();

    // TODO remove when we have the service call
    this.activeSampleGroup = {};
    this.activeSampleGroup.persons = [];
    this.activeSampleGroup.organizations = [];
    this.activeSampleGroup.publications = [];
    this.activeSampleGroup.databases = [];
    this.activeSampleGroup.termSources = [];

    // // If there is no active project stored in session.
    // if (!this.activeProject) {
    //   this.submissionsService.getActiveSubmissionProject().subscribe(
    //     (data) => {
    //       if (data) {
    //         this.activeProject = data;
    //         this.updateProjectForm(
    //           this.activeProject.alias,
    //           this.activeProject.title,
    //           this.activeProject.description,
    //           this.activeProject.releaseDate
    //         );
    //       }

    //     },
    //     (error) => {
    //     }
    //   );
    // } else {
    //   this.updateProjectForm(
    //     this.activeProject.alias,
    //     this.activeProject.title,
    //     this.activeProject.description,
    //     this.activeProject.releaseDate
    //   );
    // }
  }

  updateProjectForm(alias, title, description = '', releaseDate) {
    // this.projectForm.controls['projectShortName'].setValue(alias);
    // this.projectForm.controls['projectTitle'].setValue(title);
    // this.projectForm.controls['projectDescription'].setValue(description);
    // this.projectForm.controls['releaseDate'].setValue(releaseDate);
  }

  /**
   * Load list of projects for exisitng user.
   */
  onLoadProjects() {
    // this.userService.getUserProjects().subscribe(
    //   (data) => {
    //     if (!data.hasOwnProperty('_embedded')) {
    //       return false;
    //     }

    //     this.projects = data['_embedded']['projects'];
    //   },
    //   (err) => {
    //     // TODO: Handle Errors.
    //     console.log(err);
    //   }
    // );
  }

  /**
   * On Change projects list select.
   */
  onSelectProject() {
    // If Create a new project then disable select list.
    // if (this.projectForm.value.project !== '_create') {
    //   this.updateProjectForm(
    //     this.projects[this.projectForm.value.project].alias,
    //     this.projects[this.projectForm.value.project].title,
    //     this.projects[this.projectForm.value.project].description,
    //     this.projects[this.projectForm.value.project].releaseDate
    //   );
    // } else {
    //   this.updateProjectForm('', '', '', '');
    // }
  }

  /**
   * This function set default value for forms and load submission content data.
   */
  initializeForm() {
    // Set Active Submission.
    this.activeSubmission = this.submissionsService.getActiveSubmission();

    this.viewOnly = this.pageService.setSubmissionViewMode(this.activeSubmission._links.submissionStatus.href);

    this.sampleGroupForm = this.formBuilder.group({
      submissionForm: this.formBuilder.group({
        submissionTitle: [''],
        submissionDescription: [''],
        submissionVersion: [''],
        submissionUpdateDate: [''],
        submissionReleaseDate: [''],
      }),
      personForm: this.formBuilder.group({
        lastname: [''],
        initials: [''],
        firstname: [''],
        email: [''],
        role: [''],
      }),
      organizationForm: this.formBuilder.group({
        name: '',
        address: '',
        uri: '',
        role: ''
      }),
      publicationForm: this.formBuilder.group({
        pubmedid: '',
        doi: ''
      }),
      databaseForm: this.formBuilder.group({
        name: '',
        id: '',
        uri: ''
      }),
      termSourceForm: this.formBuilder.group({
        name: '',
        uri: '',
        version: ''
      })
    });

    // // Load Submission Content Actions.
    // this.requestsService.get(this.activeSubmission._links.contents.href).subscribe(
    //   (data) => {
    //     this.activeSubmission['_links']['contents']['_links'] = data['_links'];
    //     this.activeSubmission['_links']['contents']['dataTypes'] = data['dataTypes'];
    //     this.submissionsService.setActiveSubmission(this.activeSubmission);
    //   },
    //   (err) => {
    //     // TODO: Handle Errors.
    //     console.log(err);
    //   }
    // );
  }

  onAddPerson() {
    const personForm = this.sampleGroupForm.get('personForm');
    if (personForm.valid) {
      if (this.selectedIndex > -1) {
        this.activeSampleGroup.persons[this.selectedIndex] = personForm.value;
      } else {
        this.activeSampleGroup.persons.push(personForm.value);
      }

      // TODO when we have the data model
      // const projectUpdateUrl = this.activeSampleGroup._links['self:update'].href;
      // this.requestsService.update(projectUpdateUrl, this.activeSampleGroup).subscribe(
      //   (project) => {
      //     this.submissionsService.setActiveSaactiveSampleGroup(project);
      //   },
      //   (error) => {
      //     // TODO: Handle errors.
      //     console.log(error);
      //   }
      // );

      personForm.reset();
      this.editMode = false;
      this.selectedIndex = -1;
    }
  }

  onEditPerson(personIndex: number) {
    const personForm = this.sampleGroupForm.get('personForm');
    const selectedPerson = this.activeSampleGroup.persons[personIndex];
    personForm.get('lastname').setValue(selectedPerson.lastname);
    personForm.get('initials').setValue(selectedPerson.initials);
    personForm.get('firstname').setValue(selectedPerson.firstname);
    personForm.get('email').setValue(selectedPerson.email);
    personForm.get('role').setValue(selectedPerson.role);

    this.editMode = true;
    this.selectedIndex = personIndex;
  }

  onDeletePerson(personIndex: number) {
    this.activeSampleGroup.persons.splice(personIndex, 1);

    // TODO when we have the data model
    // const projectUpdateUrl = this.activeProject._links['self:update'].href;
    // this.requestsService.update(projectUpdateUrl, this.activeProject).subscribe(
    //   (project) => {
    //     this.submissionsService.setActiveProject(project);
    //   },
    //   (error) => {
    //     // TODO: Handle errors.
    //     console.log(error);
    //   }
    // );
  }



  // TODO clean these above methods

  onAddOrganization() {
    const organizationForm = this.sampleGroupForm.get('organizationForm');
    if (organizationForm.valid) {
      if (this.selectedIndex > -1) {
        this.activeSampleGroup.organizations[this.selectedIndex] = organizationForm.value;
      } else {
        this.activeSampleGroup.organizations.push(organizationForm.value);
      }

      // TODO when we have the data model do the update in the DB

      organizationForm.reset();
      this.editMode = false;
      this.selectedIndex = -1;
    }
  }

  onEditOrganization(organizationIndex: number) {
    const organizationForm = this.sampleGroupForm.get('organizationForm');
    const selectedOrganization = this.activeSampleGroup.organizations[organizationIndex];
    organizationForm.get('name').setValue(selectedOrganization.name);
    organizationForm.get('address').setValue(selectedOrganization.address);
    organizationForm.get('uri').setValue(selectedOrganization.uri);
    organizationForm.get('role').setValue(selectedOrganization.role);

    this.editMode = true;
    this.selectedIndex = organizationIndex;
  }

  onDeleteOrganization(organizationIndex: number) {
    this.activeSampleGroup.organizations.splice(organizationIndex, 1);

    // TODO when we have the data model do the update in the DB
  }

  onAddPublication() {
    const publicationForm = this.clearWhitespaces(this.sampleGroupForm.get('publicationForm'));

    if (this.isFormEmpty(publicationForm) === true) {
      publicationForm.reset();
      return;
    }

    if (publicationForm.valid) {
      if (this.selectedIndex > -1) {
        this.activeSampleGroup.publications[this.selectedIndex] = publicationForm.value;
      } else {
        this.activeSampleGroup.publications.push(publicationForm.value);
      }

      // TODO when we have the data model do the update in the DB

      publicationForm.reset();
      this.editMode = false;
      this.selectedIndex = -1;
    }
  }

  onEditPublication(publicationIndex: number) {
    const publicationForm = this.sampleGroupForm.get('publicationForm');
    const selectedpublication = this.activeSampleGroup.publications[publicationIndex];
    publicationForm.get('pubmedid').setValue(selectedpublication.pubmedid);
    publicationForm.get('doi').setValue(selectedpublication.doi);

    this.editMode = true;
    this.selectedIndex = publicationIndex;
  }

  onDeletePublication(publicationIndex: number) {
    this.activeSampleGroup.publications.splice(publicationIndex, 1);

    // TODO when we have the data model do the update in the DB
  }

  onAddDatabase() {
    const databaseForm = this.clearWhitespaces(this.sampleGroupForm.get('databaseForm'));

    if (this.isFormEmpty(databaseForm) === true) {
      databaseForm.reset();
      return;
    }

    if (databaseForm.valid) {
      if (this.selectedIndex > -1) {
        this.activeSampleGroup.databases[this.selectedIndex] = databaseForm.value;
      } else {
        this.activeSampleGroup.databases.push(databaseForm.value);
      }

      // TODO when we have the data model do the update in the DB

      databaseForm.reset();
      this.editMode = false;
      this.selectedIndex = -1;
    }
  }

  onEditDatabase(databaseIndex: number) {
    const databaseForm = this.sampleGroupForm.get('databaseForm');
    const selectedDatabase = this.activeSampleGroup.databases[databaseIndex];
    databaseForm.get('name').setValue(selectedDatabase.name);
    databaseForm.get('id').setValue(selectedDatabase.id);
    databaseForm.get('uri').setValue(selectedDatabase.uri);

    this.editMode = true;
    this.selectedIndex = databaseIndex;
  }

  onDeleteDatabase(databaseIndex: number) {
    this.activeSampleGroup.databases.splice(databaseIndex, 1);

    // TODO when we have the data model do the update in the DB
  }

  onAddTermSource() {
    const termSourceForm = this.clearWhitespaces(this.sampleGroupForm.get('termSourceForm'));

    if (this.isFormEmpty(termSourceForm) === true) {
      termSourceForm.reset();
      return;
    }

    if (termSourceForm.valid) {
      if (this.selectedIndex > -1) {
        this.activeSampleGroup.termSources[this.selectedIndex] = termSourceForm.value;
      } else {
        this.activeSampleGroup.termSources.push(termSourceForm.value);
      }

      // TODO when we have the data model do the update in the DB

      termSourceForm.reset();
      this.editMode = false;
      this.selectedIndex = -1;
    }
  }

  onEditTermSource(termSourceIndex: number) {
    const termSourceForm = this.sampleGroupForm.get('termSourceForm');
    const selectedtermSource = this.activeSampleGroup.termSources[termSourceIndex];
    termSourceForm.get('name').setValue(selectedtermSource.name);
    termSourceForm.get('uri').setValue(selectedtermSource.uri);
    termSourceForm.get('version').setValue(selectedtermSource.version);

    this.editMode = true;
    this.selectedIndex = termSourceIndex;
  }

  onDeleteTermSource(termSourceIndex: number) {
    this.activeSampleGroup.termSources.splice(termSourceIndex, 1);

    // TODO when we have the data model do the update in the DB
  }

  private updateSubmissionContent() {
  //   const submissionUpdateUrl = this.activeSubmission._links['self:update'].href;
  //   const submissionUpdateData = this.activeSubmission;
  //   submissionUpdateData['projectName'] = this.projectForm.value.projectShortName;
  //   // Update the submission.
  //   this.requestsService.update(submissionUpdateUrl, submissionUpdateData).subscribe((data) => {
  //     this.getSubmissionContents(data);
  //   }, (err) => {
  //     // TODO: Handle Errors.
  //     console.log(err);
  //   });
  }

  private isFormEmpty(form: AbstractControl) {
    let isEmpty = true;
    const formElement = Object.keys(form.value);
    for (const element of formElement) {
      const elementValue = form.value[element];
      if (elementValue != null && elementValue !== '') {
        isEmpty = false;
      }
    }

    return isEmpty;
  }

  private clearWhitespaces(form: AbstractControl) {
    const formElement = Object.keys(form.value);
    for (const element of formElement) {
      form.value[element] = form.value[element] == null ? '' : form.value[element].trim();
    }

    return form;
  }
}

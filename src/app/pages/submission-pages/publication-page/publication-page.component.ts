import { Router } from '@angular/router';
import { PublicationStatus } from './../../../models/publication-status';
import { Component, OnInit } from '@angular/core';
import { SubmissionsService } from 'src/app/services/submissions.service';
import { FormGroup, FormControl } from '@angular/forms';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-publication-page',
  templateUrl: './publication-page.component.html',
  styleUrls: ['./publication-page.component.scss']
})
export class PublicationPageComponent implements OnInit {
  activeSubmission: any;
  activeProject: any;
  publicationForm: FormGroup;
  publicationStatuses = PublicationStatus.values();
  editMode = false;
  selectedPublicationIndex = -1;

  constructor(
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.publicationForm = new FormGroup({
      articleTitle: new FormControl(''),
      authors: new FormControl(''),
      journalTitle: new FormControl(''),
      journalIssn: new FormControl(''),
      issue: new FormControl(''),
      year: new FormControl(''),
      volume: new FormControl(''),
      pageInfo: new FormControl(''),
      pubmedId: new FormControl(''),
      doi: new FormControl(''),
      status: new FormControl('')
    });

    this.initializeForm();
    this.getActiveProject();
  }

  /**
   * This function set default value for forms and load submission content data.
   */
  initializeForm() {
    // Set Active Submission.
    this.activeSubmission = this.submissionsService.getActiveSubmission();
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

  onCreateProject() {
    this.router.navigate(['submission/project']);
  }

  onAddPublication() {
    if (this.selectedPublicationIndex > -1) {
      this.activeProject.publications[this.selectedPublicationIndex] = this.publicationForm.value;
    } else {
      this.activeProject.publications.push(this.publicationForm.value);
    }
    const projectUpdateUrl = this.activeProject._links['self:update'].href;
    this.requestsService.update(projectUpdateUrl, this.activeProject).subscribe(
      (project) => {
        this.submissionsService.setActiveProject(project);
      },
      (error) => {
        // TODO: Handle errors.
      }
    );
    this.publicationForm.reset();
    this.editMode = false;
    this.selectedPublicationIndex = -1;
  }

  onEditPublication(publicationIndex: number) {
    const selectedPublication = this.activeProject.publications[publicationIndex];
    this.publicationForm.controls['pubmedId'].setValue(selectedPublication.pubmedId);
    this.publicationForm.controls['articleTitle'].setValue(selectedPublication.articleTitle);
    this.publicationForm.controls['journalTitle'].setValue(selectedPublication.journalTitle);
    this.publicationForm.controls['journalIssn'].setValue(selectedPublication.journalIssn);
    this.publicationForm.controls['authors'].setValue(selectedPublication.authors);
    this.publicationForm.controls['doi'].setValue(selectedPublication.doi);
    this.publicationForm.controls['issue'].setValue(selectedPublication.issue);
    this.publicationForm.controls['year'].setValue(selectedPublication.year);
    this.publicationForm.controls['volume'].setValue(selectedPublication.volume);
    this.publicationForm.controls['pageInfo'].setValue(selectedPublication.pageInfo);
    this.publicationForm.controls['status'].setValue(selectedPublication.status);

    this.editMode = true;
    this.selectedPublicationIndex = publicationIndex;
  }

  onDeletePublication(publicationIndex: number) {
    this.activeProject.publications.splice(publicationIndex, 1);
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

  onSaveExit() {
    this.submissionsService.deleteActiveSubmission();
    this.submissionsService.deleteActiveProject();
    this.router.navigate(['/']);
  }

  onSaveContinue() {
    this.router.navigate(['/submission/contacts']);
  }
}

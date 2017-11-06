import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-study-page',
  templateUrl: './study-page.component.html',
  styleUrls: ['./study-page.component.scss'],
  providers: [
    SubmissionsService,
    RequestsService,
    TokenService
  ]
})
export class StudyPageComponent implements OnInit {
  studyForm : FormGroup;
  submission: any;
  token: string;

  tabLinks: any = [
    {"title": "Overview", "href": "/submission/overview"},
    {"title": "Study", "href": "/submission/study"},
    {"title": "Data", "href": "/submission/data"},
    {"title": "Experiment", "href": "/submission/experiment"},
    {"title": "Samples", "href": "/submission/samples"},
    {"title": "Contacts", "href": "/submission/contacts"},
    {"title": "Submit", "href": "/submission/submit"},
  ];

  constructor(
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private tokenService: TokenService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    this.studyForm = new FormGroup({
      studyTitle: new FormControl('', Validators.required),
      studyDescription: new FormControl('', Validators.required),
      studyShortName: new FormControl('', Validators.required)
    });

    this.submission = this.submissionsService.getActiveSubmission();
    // Load Current Submission Studies.
    this.getSubmissionStudies();
  }

  /**
   * On Save and Exit.
   */
  onSaveExit() {
    // TODO: Save the data.
    this.submissionsService.deleteActiveSubmission();
    this.router.navigate(["/home"]);
  }

  /**
   * On Save and continue.
   */
  onSaveContinue() {
    // TODO: Save the data.
    let submissionStudyCreateUrl = this.submission._links.contents._links['studies:create'].href;
    let submissionStudyDataObject = {
      'alias' : this.studyForm.value.studyShortName,
      'title' : this.studyForm.value.studyTitle,
      'description' : this.studyForm.value.studyDescription
    };
    // Create the study.
    this.requestsService.create(this.token, submissionStudyCreateUrl, submissionStudyDataObject).subscribe (
      (data) => {
        // Study Created, Update the Submission object.
        this.getSubmissionStudies();
        // Redirect to submission data page.
        this.router.navigate(["/submission/data"]);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  /**
   * Return true when form is ready to submit.
   */
  onReady() {
    console.log(this.studyForm);
    // TODO: Add form validation.
    return this.studyForm.valid;
  }

  /**
   * Get Current Submission Studies.
   */
  getSubmissionStudies() {
    let submissionStudiesRequestUrl = this.submission._links.contents._links.studies.href;
    this.requestsService.get(this.token, submissionStudiesRequestUrl).subscribe (
      (data) => {
        if(data.page.totalElements > 0) {
          // Update current submission with studies.
          this.submission._links.contents._links.studies._embedded = data._embedded.studies;
          this.submissionsService.setActiveSubmission(this.submission);
        }
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }
}

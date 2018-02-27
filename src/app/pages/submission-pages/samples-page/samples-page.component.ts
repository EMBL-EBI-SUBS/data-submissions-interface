import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { RequestsService } from 'app/services/requests.service';
import { SpreadsheetsService } from '../../../services/spreadsheets.service';

declare var Choices;
declare var $;

@Component({
  selector: 'app-samples-page',
  templateUrl: './samples-page.component.html',
  styleUrls: ['./samples-page.component.scss'],
  providers: [
    SubmissionsService,
    TeamsService,
    TokenService,
    RequestsService,
    SpreadsheetsService,
  ]
})
export class SamplesPageComponent implements OnInit {
  samplesForm: FormGroup;
  activeSubmission: any;
  activeSpreadsheet: any;
  submittionSamples: any = {};
  token: String;
  templatesList: any;
  selectedTemplate: any = {};
  activeTab: string = 'samples-upload';
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 50,
    lengthChange: false
  };

  public loading = false;


  tabLinks: any = [
    { "title": "Overview", "href": "/submission/overview" },
    { "title": "Project", "href": "/submission/project" },
    { "title": "Data", "href": "/submission/data" },
    { "title": "Samples", "href": "/submission/samples" },
    { "title": "Protocols", "href": "/submission/protocols" },
    { "title": "Contacts", "href": "/submission/contacts" },
    { "title": "Submit", "href": "/submission/submit" },
  ];

  constructor(
    private router: Router,
    private submissionsService: SubmissionsService,
    private teamsService: TeamsService,
    private requestsService: RequestsService,
    private tokenService: TokenService,
    private spreadsheetsService: SpreadsheetsService
  ) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    this.activeSpreadsheet = this.spreadsheetsService.getActiveSpreadsheet();
    this.getTemplatesList();

    this.samplesForm = new FormGroup({
      samplesSource: new FormControl('', Validators.required),
      samplesSpecies: new FormControl('', Validators.required),
    });

    this.setFormDefaultValues();
    this.getSubmissionContents(this.activeSubmission);
  }


  /**
   * Initialize the Choices Plugin.
   */
  ngAfterViewInit() {
    const multipleCancelButton = new Choices('select.choices', {
      delimiter: ',',
      editItems: true,
      maxItemCount: 5,
      removeItemButton: true,
    });
  }

  onSaveExit() {
    this.submissionsService.deleteActiveSubmission();
    this.submissionsService.deleteActiveProject();
    this.teamsService.deleteActiveTeam();

    this.router.navigate(['/']);
  }

  onSaveContinue() {
    let samplesData = {};
    samplesData['samplesSource'] = this.samplesForm.value.samplesSource;
    samplesData['samplesSpecies'] = this.samplesForm.value.samplesSpecies;

    this.activeSubmission['uiData']['samples'] = samplesData;
    let submissionUpdateUrl = this.activeSubmission._links['self:update'].href;


    // Update the submission.
    this.requestsService.update(this.token, submissionUpdateUrl, this.activeSubmission).subscribe(
      (data) => {
        this.submissionsService.setActiveSubmission(data);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );

    this.router.navigate(['/submission/protocols']);
  }

  activateTab(tabName) {
    this.activeTab = tabName;
  }

  convertToSlug(Text) {
    return Text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      ;
  }

  setFormDefaultValues() {
    try {
      this.samplesForm.controls['samplesSource'].setValue(this.activeSubmission.uiData.samples.samplesSource);
      this.samplesForm.controls['samplesSpecies'].setValue(this.activeSubmission.uiData.samples.samplesSpecies);
    } catch (err) {

    }
  }

  getTemplatesList() {
    this.spreadsheetsService.getTemplatesList(this.token).subscribe(
      (data) => {
        try {
          this.templatesList = data._embedded.templates;
        } catch (e) {
          console.log(e);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSelectTemplate(ev) {
    let selectedOptionValue = ev.target.value;

    if (selectedOptionValue !== "_none") {
      try {
        this.selectedTemplate['name'] = selectedOptionValue;
        this.selectedTemplate['href'] = ev.target.selectedOptions[0].dataset.href;
      } catch (e) {
        console.log(e);
      }
    } else {
      this.selectedTemplate = {};
    }
  }

  previewCSVFile(event) {
    this.loading = true;

    let templateUploadLink = this.activeSubmission._links.contents._links['sheetUpload'].href.replace('{templateName}', this.selectedTemplate['name']);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let fileResults: any;

      try {
        fileResults = window.atob(e.target.result.replace('data:text/csv;base64,', ''));
      } catch (err) {
        console.log(err);
        this.loading = false;
        return false;
      }

      this.spreadsheetsService.create(this.token, templateUploadLink, fileResults).subscribe(
        (data) => {
          this.activeSpreadsheet = data;
          this.spreadsheetsService.setActiveSpreadsheet(this.activeSpreadsheet);
          this.getSubmissionSamples();
          event.target.value = null;
        },
        (err) => {
          this.loading = false;
          event.target.value = null;
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  getSubmissionSamples() {
    let submissionSamplesLink = this.activeSubmission._links.contents._links.samples.href;

    this.requestsService.get(this.token, submissionSamplesLink).subscribe(
      data => {
        this.submittionSamples = data;
        this.loading = false;
        try {
          if (data._embedded.samples && data._embedded.samples.length > 0) {
            this.activateTab("samples-view");
          }
        } catch (e) {

        }
      },
      err => {
        console.log(err);
        this.loading = false;
      }
    )
  }

  /**
 * When click on pager, update submissions.
 * @param {string} action
 */
  onPagerClick(action: string) {
    this.loading = true;
    let getSubmissionSamplesUrl = this.submittionSamples._links[action].href;
    this.submittionSamples = this.getUserSubmissionsSamplesByUrl(getSubmissionSamplesUrl);
  }

  getUserSubmissionsSamplesByUrl(serviceUrl) {
    this.requestsService.get(this.token, serviceUrl).subscribe (
      (data) => {
        // Store active submission in a local variable.
        this.submittionSamples = data;
        this.loading = false;
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
        this.loading = false;
      }
    );
  }

  triggerUpload() {
    $("input[name='csv-template']").click();
    return false;
  }

  getSubmissionContents(submission: any) {
    const submissionLinksRequestUrl = submission._links.contents.href;
    this.submissionsService.get(this.token, submissionLinksRequestUrl).subscribe(
      (data) => {
        submission._links.contents['_links'] = data._links;
        this.submissionsService.setActiveSubmission(submission);
        // Load Samples Data.
        this.getSubmissionSamples();
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }
}

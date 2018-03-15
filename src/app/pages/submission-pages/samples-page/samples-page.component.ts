import { Component, OnInit, NgModule, ViewChildren, QueryList } from '@angular/core';
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
  @ViewChildren('allSamples') samplesRows: QueryList<any>;

  objectKeys = Object.keys;
  samplesForm: FormGroup;
  activeSubmission: any;
  activeSpreadsheet: any;
  activeSample: any;
  activeSampleClonned: any;
  submittionSamples: any = {};
  errors = [];
  token: String;
  templatesList: any;
  selectedTemplate: any = {};
  activeTab: string = 'samples-upload';
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 50,
    lengthChange: false
  };
  processingSheets = [];
  blackListSampleFields = [
    'createdBy',
    'createdDate',
    'lastModifiedBy',
    'lastModifiedDate',
    'sampleRelationships',
    'team',
    'editMode',
    '_embedded',
    '_links'
  ];
  activeSampleFields = [];
  activeSampleIndex: number;

  testSampleSchema  = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Sample Schema",
    "description": "Default sample template schema.",

    "type": "object",
    "properties": {

      "alias": {
        "description": "A sample unique identifier in a submission.",
        "type": "string"
      },
      "taxonId": {
        "description": "The taxonomy id for the sample species.",
        "type": "integer"
      },
      "taxon": {
        "description": "The taxonomy name for the sample species.",
        "type": "string"
      },
      "title":{
        "description": "A sample title",
        "type": "string"
      },
      "description":{
        "description": "A sample description",
        "type": "string"
      }
    },
    "required": ["alias", "title", "taxonId", "taxon"]
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

    this.samplesRows.changes.subscribe(t => {
      this.ngForSamplesRendred();
    })
  }

  onSaveExit() {
    this.submissionsService.deleteActiveSubmission();
    this.submissionsService.deleteActiveProject();
    this.teamsService.deleteActiveTeam();

    this.router.navigate(['/']);
  }

  ngForSamplesRendred() {
    $('.reveal-button, .reveal-form').foundation();
    console.log("Samples rendered");
  }

  editModeSample(sample) {
    sample['editMode'] = true;
  }

  setActiveSample(sample, index) {
    this.activeSample = sample;
    this.activeSampleClonned = sample;
    this.activeSampleIndex = index;
  }

  onUpdateSample() {
    this.loading = true;
    let updateLink = this.activeSample._links.self.href;
    let updateData = {};

    for (let key of this.activeSampleFields) {
      updateData[key] = this.activeSampleClonned[key];
    }


    this.requestsService.partialUpdate(this.token, updateLink, updateData).subscribe(
     data => {
       this.loading = false;
       this.errors = [];
       // Update table data.
       for (let key in data) {
        this.submittionSamples._embedded.samples[this.activeSampleIndex][key] = data[key];
       }
       // CLose the popup.
       $('.close-button').click();
     },
     err => {
       try {
        let error = JSON.parse(err['_body']);
        this.errors = error.errors;
       } catch (e) {

       }

       this.loading = false;

     }
    )
  }

  addSampleActiveKey(keyName) {
    if (this.activeSampleFields.indexOf(keyName) < 0) {
      this.activeSampleFields.push(keyName);
    }
    return true;
  }

  checkProcessingSheets() {
   let samplesSheets = this.activeSubmission._links.contents._links['samplesSheets'].href;

   this.requestsService.get(this.token, samplesSheets).subscribe(
     data => {
      try {
        if(data['_embedded']['sheets'].length > 0) {
          let tempProcessingSheets = [];

          for (let processingSheet of data['_embedded']['sheets']) {
            if (processingSheet['status'] !== "Completed") {
              tempProcessingSheets.push(processingSheet);
            }
          }
          if (tempProcessingSheets.length == 0) {
            this.processingSheets = [];
          } else {
            this.processingSheets = tempProcessingSheets;
            let that = this;
            setTimeout(function(){
              that.checkProcessingSheets();
            } ,10000);
          }
        }
      } catch (e) {

      }
     },
     err => {

     }
   )
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
          this.checkProcessingSheets();
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
        // Get Uploaded Sheets Status.
        this.checkProcessingSheets();
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }
}

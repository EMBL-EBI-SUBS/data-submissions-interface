import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
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
  token: String;
  templatesList =  [];
  selectedTemplate = {};


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
    this.getTemplatesList();

    this.samplesForm = new FormGroup({
      samplesSource: new FormControl('', Validators.required),
      samplesSpecies: new FormControl('',  Validators.required),
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
    this.requestsService.update(this.token, submissionUpdateUrl, this.activeSubmission).subscribe (
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

  convertToSlug(Text) {
    return Text
      .toLowerCase()
      .replace(/ /g,'-')
      .replace(/[^\w-]+/g,'')
      ;
  }

  setFormDefaultValues() {
    try {
      this.samplesForm.controls['samplesSource'].setValue(this.activeSubmission.uiData.samples.samplesSource);
      this.samplesForm.controls['samplesSpecies'].setValue(this.activeSubmission.uiData.samples.samplesSpecies);
    } catch(err) {

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
      (error) =>  {
        console.log(error);
      }
    );
  }

  onSelectTemplate(ev) {
    let selectedOptionValue = ev.target.value;

    if(selectedOptionValue !== "_none") {
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
    let templateUploadLink = this.activeSubmission._links.contents._links['samples:sheetUpload'].href.replace('{templateName}', this.selectedTemplate['name']);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let fileResults = window.atob(e.target.result.replace('data:text/csv;base64,', ''));
      console.log(fileResults);
      this.spreadsheetsService.create(this.token, templateUploadLink, fileResults).subscribe (
        (data) => {
          console.log(data);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  triggerUpload() {
    $("input[name='csv-template']").click();
    return false;
  }

  getSubmissionContents(submission: any) {
    const submissionLinksRequestUrl = submission._links.contents.href;
    this.submissionsService.get(this.token, submissionLinksRequestUrl).subscribe (
      (data) => {
        submission._links.contents['_links'] = data._links;
        this.submissionsService.setActiveSubmission(submission);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }
}

import {
  Component,
  OnInit,
  NgModule,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  FormControlName,
  Validators
} from '@angular/forms';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { RequestsService } from '../../../services/requests.service';
import { SpreadsheetsService } from '../../../services/spreadsheets.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-metadata-page',
  templateUrl: './metadata-page.component.html',
  styleUrls: ['./metadata-page.component.scss'],
  providers: [
    SubmissionsService,
    TeamsService,
    RequestsService,
    SpreadsheetsService
  ]
})
export class MetadataPageComponent implements OnInit {
  @ViewChildren('allSamples')
  samplesRows: QueryList<any>;

  id: string;
  objectKeys = Object.keys;
  sampleAttributes: any[] = [];
  activeSubmission: any;
  activeSpreadsheet: any;
  activeSample: any;
  activeDataType: any;
  submittionSamples: any = {};
  formPathStringMap: any = {};
  errors = [];
  templatesList: any;
  selectedTemplate: any = {};
  activeTab = 'samples-upload';

  processingSheets = [];
  blackListSampleFields = [
    'fields',
    'createdBy',
    'createdDate',
    'lastModifiedBy',
    'lastModifiedDate',
    'sampleRelationships',
    'team',
    'attributes',
    'accession',
    'editMode',
    '_embedded',
    '_links'
  ];
  activeSampleFields = [];
  activeSampleIndex: number;

  validationSchemaUrl = environment.validationSchemaEndpoint;

  public loading = false;

  constructor(
    private router: Router,
    private submissionsService: SubmissionsService,
    private teamsService: TeamsService,
    private requestsService: RequestsService,
    private spreadsheetsService: SpreadsheetsService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();

    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      this.templatesList = [];
      this.loading = true;
      this.activeDataType = this.getActiveDataType();
      this.getDataTypeContent();
    });
  }

  /**
   * Get active data type from local submission object.
   */
  getActiveDataType() {
    let dataTypes = [];
    try {
      dataTypes = this.activeSubmission._links.contents.dataTypes;
    } catch (e) {}

    for (const dataType of dataTypes) {
      if (dataType.id === this.id) {
        return dataType;
      }
    }

    return {};
  }

  /**
   * Get DataType content links.
   */
  getDataTypeContent() {
    this.requestsService
      .get(this.activeSubmission._links.contents._links[this.id].href)
      .subscribe(
        data => {
          Object.assign(this.activeDataType, data);
          this.getTemplatesList();
          this.loading = false;
        },
        err => {
          console.log(err);
          this.loading = false;
        }
      );
  }

  onSaveExit() {
    // this.submissionsService.deleteActiveSubmission();
    // this.submissionsService.deleteActiveProject();
    // this.teamsService.deleteActiveTeam();
    // this.router.navigate(['/']);
  }

  addSampleActiveKey(keyName) {
    // if (this.activeSampleFields.indexOf(keyName) < 0) {
    //   this.activeSampleFields.push(keyName);
    // }
    // return true;
  }

  checkProcessingSheets() {
    // const samplesSheets = this.activeSubmission._links.contents._links['samplesSheets'].href;
    // this.requestsService.get(samplesSheets).subscribe(
    //   data => {
    //     try {
    //       if (data['_embedded']['sheets']['length'] > 0) {
    //         const tempProcessingSheets = [];
    //         for (const processingSheet of data['_embedded']['sheets']) {
    //           if (processingSheet['status'] !== 'Completed') {
    //             tempProcessingSheets.push(processingSheet);
    //           }
    //         }
    //         if (tempProcessingSheets['length'] === 0) {
    //           this.processingSheets = [];
    //           this.getSubmissionSamples();
    //         } else {
    //           this.processingSheets = tempProcessingSheets;
    //           const that = this;
    //           setTimeout(function () {
    //             that.checkProcessingSheets();
    //           }, 10000);
    //         }
    //       }
    //     } catch (e) {
    //     }
    //   },
    //   err => {
    //   }
    // )
  }

  onSaveContinue() {
    this.elementRef.nativeElement
      .querySelector('li.tabs-title.active+li a')
      .click();

    // const submissionUpdateUrl = this.activeSubmission._links['self:update'].href;

    // // Update the submission.
    // this.requestsService.update(submissionUpdateUrl, this.activeSubmission).subscribe(
    //   (data) => {
    //     this.submissionsService.setActiveSubmission(data);
    //   },
    //   (err) => {
    //     // TODO: Handle Errors.
    //     console.log(err);
    //   }
    // );

    // this.router.navigate(['/submission/protocols']);
  }

  activateTab(tabName) {
    this.activeTab = tabName;
  }

  convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  getTemplatesList() {
    this.requestsService
      .get(this.activeDataType['_links'].checklists.href)
      .subscribe(
        (data: any) => {
          if (data.page.totalElements > 0) {
            this.templatesList = data._embedded.checklists;
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  onSelectTemplate(ev) {
    const selectedOptionValue = ev.target.value;

    if (selectedOptionValue !== '_none') {
      try {
        this.selectedTemplate['name'] = selectedOptionValue;
        this.selectedTemplate['href'] =
          ev.target.selectedOptions[0].dataset.href;
        this.selectedTemplate['description'] =
          ev.target.selectedOptions[0].dataset.description;
      } catch (e) {
        console.log(e);
      }
    } else {
      this.selectedTemplate = {};
    }
  }

  previewCSVFile(event) {
    this.loading = true;
    const templateUploadLink = this.activeDataType[
      '_links'
    ].sheetUpload.href.replace('{checklistId}', this.selectedTemplate['name']);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let fileResults: any;

      try {
        fileResults = window.atob(
          e.target.result.replace('data:text/csv;base64,', '')
        );
      } catch (err) {
        console.log(err);
        this.loading = false;
        return false;
      }

      this.spreadsheetsService
        .create(templateUploadLink, fileResults)
        .subscribe(
          data => {
            console.log(this.activeDataType);
            this.getSubmissionSamples();
            this.checkProcessingSheets();
            this.loading = false;
          },
          err => {
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
    // const submissionSamplesLink = this.activeSubmission._links.contents._links.samples.href;
    // this.requestsService.get(submissionSamplesLink).subscribe(
    //   data => {
    //     this.submittionSamples = data;
    //     this.loading = false;
    //     try {
    //       if (data['_embedded']['samples'] && data['_embedded']['samples']['length'] > 0) {
    //         this.activateTab('samples-view');
    //       }
    //     } catch (e) {
    //     }
    //   },
    //   err => {
    //     console.log(err);
    //     this.loading = false;
    //   }
    // )
  }

  /**
   * When click on pager, update submissions.
   * @param {string} action
   */
  onPagerClick(action: string) {
    this.loading = true;
    const getSubmissionSamplesUrl = this.submittionSamples._links[action].href;
    this.submittionSamples = this.getUserSubmissionsSamplesByUrl(
      getSubmissionSamplesUrl
    );
  }

  getUserSubmissionsSamplesByUrl(serviceUrl) {
    this.requestsService.get(serviceUrl).subscribe(
      data => {
        // Store active submission in a local variable.
        this.submittionSamples = data;
        this.loading = false;
      },
      err => {
        // TODO: Handle Errors.
        console.log(err);
        this.loading = false;
      }
    );
  }

  triggerUpload() {
    this.elementRef.nativeElement
      .querySelector('input[name=\'csv-template\']')
      .click();
    return false;
  }
}

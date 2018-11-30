import {
  Component,
  OnInit,
  ElementRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { RequestsService } from '../../../services/requests.service';
import { SpreadsheetsService } from '../../../services/spreadsheets.service';

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
  id: string;
  objectKeys = Object.keys;
  activeSubmission: any;
  activeMetadataRow: any;
  activeDataType: any;
  submissionMetadata: any;
  templatesList: any;
  selectedTemplate: any;
  templateForm = this._fb.group({
    selectedTemplate: [''],
  });

  metadataTableHeaders = [];

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
    'errors',
    'contacts',
    'projectRef',
    'protocolRefs',
    '_embedded',
    '_links'
  ];
  activeMetadataFields = [];
  activeMetadataIndex: number;
  public loading = false;

  constructor(
    private router: Router,
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private spreadsheetsService: SpreadsheetsService,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private _fb: FormBuilder,
    public ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.resetVariables();
      this.activeSubmission = this.submissionsService.getActiveSubmission();
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
    if (!this.activeSubmission) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    this.requestsService
      .get(this.activeSubmission._links.contents._links[this.id].href)
      .subscribe(
        data => {
          Object.assign(this.activeDataType, data);
          this.getSubmissionMetadata();
          this.getTemplatesList();
        },
        err => {
          console.log(err);
          this.loading = false;
        }
      );
  }

  processMetadataTableHeaders() {
    const originalHeaders = this.objectKeys(this.submissionMetadata._embedded[this.objectKeys(this.submissionMetadata._embedded)[0]][0]);

    for (const keyName of originalHeaders) {
      if (this.blackListSampleFields.indexOf(keyName) < 0) {
        this.addMetadataActiveKey(keyName);
        this.metadataTableHeaders.push(keyName);
      }
    }
  }

  /**
   * Set metadata header columns based on first row keys.
   */
  addMetadataActiveKey(keyName: string) {
    if (this.activeMetadataFields.indexOf(keyName) < 0) {
      this.activeMetadataFields.push(keyName);
    }
  }

  /**
   * Get processing sheets status once user submit a sheet.
   */
  checkProcessingSheets() {
    if (!this.submissionMetadata) {
      return false;
    }

    const metadataSheets = this.submissionMetadata._links['spreadsheets'].href;
    this.requestsService.get(metadataSheets).subscribe(
      data => {
        try {
          if (data['_embedded']['spreadsheets']['length'] > 0) {
            const tempProcessingSheets = [];
            for (const processingSheet of data['_embedded']['spreadsheets']) {
              if (processingSheet['status'] !== 'Completed') {
                tempProcessingSheets.push(processingSheet);
              }
            }
            if (tempProcessingSheets['length'] === 0) {
              this.processingSheets = [];
              this.getSubmissionMetadata();
            } else {
              this.processingSheets = tempProcessingSheets;
              const that = this;
              setTimeout(function () {
                that.checkProcessingSheets();
              }, 10000);
            }
          }
        } catch (e) {
        }
      },
      err => {
      }
    );
  }

  /**
   * Remove metadata object from the submission.
   */
  deleteMetadata(metadata: any, index: number) {
    if (confirm('Are you sure you want to delete the item?')) {
      this.loading = true;
      this.requestsService.delete(metadata['_links']['self:delete'].href).subscribe(
        data => {
          this.submissionMetadata._embedded[Object.keys(this.submissionMetadata._embedded)[0]].splice(index, 1);
        },
        err => {
          console.log(err);
        }
      );
      this.loading = false;
    }
  }

  /**
   * On showing errors for a specific metadata row.
   */
  showMetadataErrors(metadata: any, index: number) {
    this.activeMetadataRow = metadata;
    this.activeMetadataRow.errors = [];
    for (const metadataErrorGroup in metadata._embedded.validationResult.errorMessages) {
      if (metadata._embedded.validationResult.errorMessages[metadataErrorGroup].length > 0) {
        for (const metadataError in metadata._embedded.validationResult.errorMessages[metadataErrorGroup]) {
          if (typeof metadata._embedded.validationResult.errorMessages[metadataErrorGroup][metadataError] === 'string') {
            this.activeMetadataRow.errors.push(metadata._embedded.validationResult.errorMessages[metadataErrorGroup][metadataError]);
          }
        }
      }
    }

    this.ngxSmartModalService.getModal('myModal').open();
  }

  /**
   * Retrieve list of active templates for existing metadata.
   */
  getTemplatesList() {
    this.requestsService
      .get(this.activeDataType['_links'].checklists.href)
      .subscribe(
        (data: any) => {
          if (data._embedded.checklists) {
            this.templatesList = data._embedded.checklists;
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  /**
   * Update local selectedTemplate object when user select a template.
   */
  onSelectTemplate(ev) {
    if (ev !== undefined) {
      try {
        this.selectedTemplate = ev;
      } catch (e) {
        console.log(e);
      }
    } else {
      delete this.selectedTemplate;
    }
  }

  /**
   * Read uploaded CSV and post it for processing.
   */
  previewCSVFile(event) {
    if (!event.target.files || event.target.files.length === 0) {
      return false;
    }

    this.loading = true;
    const templateUploadLink = this.activeDataType[
      '_links'
    ].sheetUpload.href.replace('{checklistId}', this.selectedTemplate['id']);
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
            this.getSubmissionMetadata();
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

  /**
   * Retrieve active metadata obejct.
   */
  getSubmissionMetadata() {
    const submissionMetadataLink = this.activeDataType._links.self.href;
    this.requestsService.get(submissionMetadataLink).subscribe(
      data => {
        try {
          this.submissionMetadata = data;
          this.processMetadataTableHeaders();
        } catch (e) {
          console.log(e);
        }
        this.loading = false;
      },
      err => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  /**
   * When click on pager, update submissions.
   */
  onPagerClick(action: string) {
    this.loading = true;
    const getSubmissionMetadataUrl = this.submissionMetadata._links[action].href;
    this.submissionMetadata = this.getUserSubmissionsMetadataByUrl(
      getSubmissionMetadataUrl
    );
  }

  /**
   * Retrieve the new metadata object when pager clicked.
   */
  getUserSubmissionsMetadataByUrl(serviceUrl: string) {
    this.requestsService.get(serviceUrl).subscribe(
      data => {
        // Store active submission in a local variable.
        this.submissionMetadata = data;
        this.loading = false;
      },
      err => {
        // TODO: Handle Errors.
        console.log(err);
        this.loading = false;
      }
    );
  }

  /**
   * Open upload popup when click on 'Upload filled template' button.
   */
  triggerUpload() {
    this.elementRef.nativeElement
      .querySelector('input[name=\'csv-template\']')
      .click();
    return false;
  }

  onSaveContinue() {
    this.resetVariables();
    this.elementRef.nativeElement
      .querySelector('li.tabs-title.active+li a')
      .click();
  }

  onSaveExit() {
    this.resetVariables();
    this.submissionsService.deleteActiveSubmission();
    this.submissionsService.deleteActiveProject();
    this.router.navigate(['/dashboard']);
  }

  resetVariables() {
    delete this.submissionMetadata;
    delete this.activeDataType;
    delete this.selectedTemplate;
    delete this.templatesList;
    delete this.activeMetadataRow;
    this.processingSheets = [];
    this.activeMetadataFields = [];
    this.templateForm.reset();
  }
}

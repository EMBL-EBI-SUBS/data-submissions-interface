import { PageService } from './../../../services/page.service';
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
import { SubmissionStatus } from 'src/app/models/submission-status';

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
  selectedMetadataErrorMessages = {};
  selectedMetadataAttributes = new Object;
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
    'attributes',
    'fields',
    'createdBy',
    'createdDate',
    'lastModifiedBy',
    'lastModifiedDate',
    'sampleRelationships',
    'team',
    'accession',
    'errors',
    'contacts',
    'protocolRefs',
    '_embedded',
    '_links'
  ];
  activeMetadataFieldsPath = [];
  activeMetadataIndex: number;
  public loading = false;

  dataFieldMappingWithArray = {
    'assayRefs': ['alias'],
    'sampleUses': ['sampleRef', 'alias'],
    'protocolUses': ['protocolRef', 'alias'],
    'files': ['name']
  };
  dataFieldMappingSimple = {
    'studyRef': ['alias'],
    'projectRef': ['alias']
  };
  metadataValues = [];
  metadataAttributes = [];

  viewOnly = false;

  constructor(
    private router: Router,
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private spreadsheetsService: SpreadsheetsService,
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private _fb: FormBuilder,
    private pageService: PageService,
    public ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.resetVariables();
      this.activeSubmission = this.submissionsService.getActiveSubmission();

      this.viewOnly = this.pageService.setSubmissionViewMode(this.activeSubmission._links.submissionStatus.href);

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

  /**
   * Set metadata header columns based on first row keys.
   */
  processMetadataTableHeaders() {
    if (!this.submissionMetadata._embedded) {
      return;
    }

    const originalHeaders = this.objectKeys(this.submissionMetadata._embedded[this.objectKeys(this.submissionMetadata._embedded)[0]][0]);

    for (const keyName of originalHeaders) {
      if (this.blackListSampleFields.indexOf(keyName) < 0) {
        this.pushIfNotExist(this.metadataTableHeaders, keyName);
      }
    }
  }

  /**
   * Push a new item into an array if it is not exists.
   * @param array the array to push the new item into
   * @param newItem the new item
   */
  pushIfNotExist(array: string[], newItem: string) {
    if (array.indexOf(newItem) < 0) {
      array.push(newItem);
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
  deleteMetadata(index: number) {
    if (confirm('Are you sure you want to delete the item?')) {
      this.loading = true;
      this.requestsService.delete(
        this.submissionMetadata._embedded[
          Object.keys(this.submissionMetadata._embedded)[0]][index]['_links']['self:delete'].href).subscribe(
            data => {
              const remainedMetadata = this.submissionMetadata._embedded[Object.keys(this.submissionMetadata._embedded)[0]];
              remainedMetadata.splice(index, 1);
              if (remainedMetadata.length < 1 ) {
                this.metadataTableHeaders = [];
                delete this.submissionMetadata;
              } else {
                this.metadataValues.splice(index, 1);
              }
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
  showMetadataErrors(errorMessage: any) {
    this.selectedMetadataErrorMessages = errorMessage;
    this.ngxSmartModalService.getModal('metadataErrorWindow').open();
  }

  /**
   * Show attributes of a selected metadata row.
   * @param attributes the attributes to display
   */
  showAttributes(attributes: Object) {
    this.selectedMetadataAttributes = attributes;
    this.ngxSmartModalService.getModal('attributesWindow').open();
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

      fileResults = this.addDefaultProjectAliasIfNotPresent(fileResults);

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

  addDefaultProjectAliasIfNotPresent(fileResults: string): string {
    const result = [];
    const lines = fileResults.split('\r\n');
    const index = this.getProjectAliasIndex(lines);

    result.push(lines.shift());
    for (let line of lines) {
      const values = line.split(',');
      if (index === values.length) {
        line = line.concat(',', this.activeSubmission.projectName);
      } else if (values[index] === '') {
        values[index] = this.activeSubmission.projectName;
        line = values.join(',');
      }

      result.push(line);
    }

    return result.join('\r\n');
  }

  getProjectAliasIndex(lines): number {
    let index = lines[0].split(',').indexOf('project alias');
    if (index === -1) {
      lines[0] = lines[0].concat(',project alias');
      index = lines[0].split(',').length - 1;
    }

    return index;
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
          this.processMetaDataValues();
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

  processMetaDataValues() {
    if (!this.submissionMetadata._embedded) {
      return;
    }

    this.metadataValues = [];
    for (const tempMetadata of this.submissionMetadata._embedded[this.objectKeys(this.submissionMetadata._embedded)[0]]) {
      const index = this.metadataValues.length;
      this.metadataValues[index] = [];
      for (const metadataKey of this.metadataTableHeaders) {
        let value = tempMetadata;
        if (!this.dataFieldMappingWithArray.hasOwnProperty(metadataKey)
                  && !this.dataFieldMappingSimple.hasOwnProperty(metadataKey)) {
          value = this.getEmbeddedValue(value, metadataKey);
        } else {
          if (this.dataFieldMappingSimple.hasOwnProperty(metadataKey)) {
          value = this.getEmbeddedValue(tempMetadata[metadataKey], this.dataFieldMappingSimple[metadataKey]);
          } else {
            const metadataObjectPath = this.getMetaDataObjectPath(metadataKey, tempMetadata[metadataKey].length);
            value = this.getMetadataObjectValue(metadataObjectPath, tempMetadata);
          }
        }

        this.metadataValues[index][metadataKey] = value;
      }

      if (tempMetadata.hasOwnProperty('attributes')) {
        this.metadataAttributes[tempMetadata['alias']] = this.getAttributes(tempMetadata['attributes']);
      }

      const errorObject = tempMetadata._embedded.validationResult.errorMessages;
      if (errorObject) {
        this.metadataValues[index]['errorMessages'] = errorObject;
      }
    }
  }

  getMetaDataObjectPath(name: string, numberOfElements: number): Object {
    return {
      'rootName': name,
      'numberOfElements': numberOfElements,
      'additionalPath': this.dataFieldMappingWithArray[name]
    };
  }

  getMetadataObjectValue(metadataObjectPath: Object, metadataObject: any) {
    const finalMetadataValue = [];
    const metadataValue = this.getEmbeddedValue(metadataObject, metadataObjectPath['rootName']);
    for (let index = 0; index < metadataObjectPath['numberOfElements']; index++) {
      let tempMetadataValue = this.getEmbeddedValue(metadataValue, index.toString());
      const metadataPath = metadataObjectPath['additionalPath'];
      for (const tempKey of metadataPath) {
        tempMetadataValue = this.getEmbeddedValue(tempMetadataValue, tempKey);
      }

      finalMetadataValue.push(tempMetadataValue);
    }

    return finalMetadataValue.join(', ');
  }

  getAttributes(attributesObject: Object): Object {
    const attributes = new Object();
    for (const attributeName of this.objectKeys(attributesObject)) {
      const attributeValue = attributesObject[attributeName][0].value;
      if (attributeValue) {
        attributes[attributeName] = attributeValue;
      }
    }

    return attributes;
  }

  getEmbeddedValue(object: any, key: string): string {
    return object[key];
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
    this.selectedMetadataErrorMessages = [];
    delete this.selectedMetadataAttributes;
    this.processingSheets = [];
    this.activeMetadataFieldsPath = [];
    this.metadataTableHeaders = [];
    this.metadataValues = [];
    this.metadataAttributes = [];
    this.templateForm.reset();
  }
}

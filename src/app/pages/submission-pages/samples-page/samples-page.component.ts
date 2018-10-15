import { Component, OnInit, NgModule, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl, FormControlName, Validators } from '@angular/forms';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { RequestsService } from '../../../services/requests.service';
import { SpreadsheetsService } from '../../../services/spreadsheets.service';
import { environment } from '../../../../environments/environment';

declare var Choices;
declare var $;

@Component({
  selector: 'app-samples-page',
  templateUrl: './samples-page.component.html',
  styleUrls: ['./samples-page.component.scss'],
  providers: [
    SubmissionsService,
    TeamsService,
    RequestsService,
    SpreadsheetsService,
  ]
})
export class SamplesPageComponent implements OnInit {
  @ViewChildren('allSamples') samplesRows: QueryList<any>;

  objectKeys = Object.keys;
  samplesForm: FormGroup;
  sampleForm: FormGroup;
  sampleAttributeForm: FormGroup;
  sampleRelationsForm: FormGroup;
  sampleAttributeTerms: FormArray;
  sampleAttributes: any[] = [];
  sampleAttribute: any = {};
  activeSubmission: any;
  activeSpreadsheet: any;
  activeSample: any;
  submittionSamples: any = {};
  formPathStringMap: any = {};
  errors = [];
  templatesList: any;
  selectedTemplate: any = {};
  activeTab: string = 'samples-upload';

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
  initialValidationSchema = {
    "schema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "A Sample Schema",
      "description": "Sample base schema",
      "type": "object",
      "properties": {
          "alias": {
              "description": "An unique identifier in a submission.",
              "type": "string",
              "minLength": 1
          },
          "title": {
              "description": "Title of the sample.",
              "type": "string",
              "minLength": 1
          },
          "description": {
              "description": "More extensive free-form description.",
              "type": "string",
              "minLength": 1
          },
          "attributes": {
              "description": "Attributes for describing a sample.",
              "type": "object",
              "properties": {},
              "patternProperties": {
                  "^.*$": {
                      "type": "array",
                      "minItems": 1,
                      "items": {
                          "properties": {
                              "value": { "type": "string", "minLength": 1 },
                              "units": { "type": "string", "minLength": 1 },
                              "terms": {
                                  "type": "array",
                                  "items": {
                                      "type": "object",
                                      "properties": {
                                          "url": {"type": "string", "format": "uri" }
                                      },
                                      "required": ["url"]
                                  }
                              }
                          },
                          "required": ["value"]
                      }
                  }
              }
          },
          "sampleRelationships": {
              "type": "array",
              "items": {
                  "type": "object",
                  "properties": {
                      "alias": { "type": "string", "minLength": 1 },
                      "accession": { "type": "string", "minLength": 1 },
                      "team": { "type": "string", "minLength": 1 },
                      "nature": {
                          "type": "string",
                          "enum": [ "derived from", "child of", "same as", "recurated from" ]
                      }
                  },
                  "oneOf": [
                      { "required": ["alias", "team", "nature"] },
                      { "required": ["accession", "nature"] }
                  ]
              }
          },
          "taxonomy": {
              "type": "object",
              "properties": {
                  "taxonId": { "type": "integer" },
                  "taxonName": { "type": "string", "minLength": 1 }
              },
              "required": ["taxonId"]
          },
          "releaseDate": {
              "type": "string",
              "format": "date"
          }
      },
      "required": [ "alias", "taxonomy", "releaseDate" ]
    },
    "object": {}
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
    private spreadsheetsService: SpreadsheetsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    this.activeSpreadsheet = this.spreadsheetsService.getActiveSpreadsheet();
    this.getTemplatesList();

    this.samplesForm = new FormGroup({
      samplesSource: new FormControl('', Validators.required),
      samplesSpecies: new FormControl('', Validators.required),
    });

    this.sampleAttributeForm = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      unit: [''],
      terms: this.fb.array([])
    });
    this.addSampleAttrTerm();

    this.sampleRelationsForm = this.fb.group({
      method: ['using-alias', Validators.required],
      alias: [''],
      team: [''],
      accession: [''],
      nature: ['', Validators.required],
    });


    this.sampleForm = this.fb.group({
      accession: [''],
      alias: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      taxonId: ['', Validators.required],
      taxon: ['', Validators.required],
      releaseDate: ['', Validators.required],
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

    let thisVar = this;

    $('[data-reveal].add-attribute-form').on('closed.zf.reveal', function () {
      thisVar.onCloseSampleAttributeModal();
    });

    $('[data-reveal].add-samples-form').on('closed.zf.reveal', function () {
      thisVar.onCloseSampleRelationsModal();
    });
  }

  onSaveExit() {
    this.submissionsService.deleteActiveSubmission();
    this.submissionsService.deleteActiveProject();
    this.teamsService.deleteActiveTeam();

    this.router.navigate(['/']);
  }

  ngForSamplesRendred() {
    $('.reveal-button, .reveal-form').foundation();
  }

  editModeSample(sample) {
    sample['editMode'] = true;
  }

  setActiveSample(sample, index) {
    this.activeSample = sample;
    this.activeSampleIndex = index;

    //  Set form default values.
    this.sampleForm.controls['accession'].setValue(sample['accession']);
    this.sampleForm.controls['alias'].setValue(sample['alias']);
    this.sampleForm.controls['title'].setValue(sample['title']);
    this.sampleForm.controls['description'].setValue(sample['description']);
    this.sampleForm.controls['taxonId'].setValue(sample['taxonId']);
    this.sampleForm.controls['taxon'].setValue(sample['taxon']);
    this.sampleForm.controls['releaseDate'].setValue(sample['releaseDate']);
  }

  onUpdateSample(sample = null) {
    this.loading = true;
    let updateLink = "";
    if (sample) {
      updateLink = sample._links.self.href;
    } else {
      updateLink = this.activeSample._links.self.href;
    }
    let updateData = {};
    this.loading = false;

    let sampleValidationObject = this.initialValidationSchema;
    sampleValidationObject['object']['taxonomy'] = {};
    delete sampleValidationObject['object']['attributes'];
    delete sampleValidationObject['object']['attributes'];


    for (let key in this.sampleForm.value) {
      if (typeof this.sampleForm.value[key] !== "undefined") {
        updateData[key] = this.sampleForm.value[key];

        if (sample && this.sampleForm.value[key] == "") {
          updateData[key] = sample[key];
        }

        if (key == "taxonId" || key == "taxonName") {
          sampleValidationObject['object']['taxonomy'][key] = this.sampleForm.value[key];
          this.formPathStringMap['.taxonomy.' + key] = this.sampleForm.get(key);
        } else {
          sampleValidationObject['object'][key] = this.sampleForm.value[key];
          this.formPathStringMap['.' + key] = this.sampleForm.get(key);
        }
      }
    }

    this.loading = true;
    this.requestsService.createNoAuth(this.validationSchemaUrl, sampleValidationObject).subscribe(
      data => {
       if(data['length'] == 0) {
          // TODO: Clean This!
          this.requestsService.partialUpdate(updateLink, updateData).subscribe(
            data => {
              this.loading = false;
              this.errors = [];
              // Update table data.
              for (let key in updateData) {
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

          // this.onUpdateSampleAttributes();
          // Close the reveal.
          $(".sample-attribute-close-button").click();
        } else {
          for(let formItemError in data) {
            this.formPathStringMap[formItemError['dataPath']].setErrors({
              'errors': formItemError['errors']
            });
          }

          this.loading = false;
        }

      },
      err => {
        console.log(err);
        this.loading = false;
      }
    )
  }

  onUpdateSampleTableCell(sample, fieldKey) {
    this.loading = true;
    let updateLink = sample._links.self.href;;
    let updateData = {};
    let sampleValidationObject = this.initialValidationSchema;

    updateData[fieldKey] = (this.sampleForm.get(fieldKey).value !== "") ? this.sampleForm.get(fieldKey).value : sample[fieldKey];
    sampleValidationObject['object'][fieldKey] = (this.sampleForm.get(fieldKey).value !== "") ? this.sampleForm.get(fieldKey).value : sample[fieldKey];
    this.formPathStringMap['.' + fieldKey] = this.sampleForm.get(fieldKey);
    this.loading = false;

    sampleValidationObject['object']['taxonomy'] = {};
    delete sampleValidationObject['object']['attributes'];
    delete sampleValidationObject['object']['attributes'];

    for (let key in this.sampleForm.value) {
      if (typeof this.sampleForm.value[key] !== "undefined" && typeof sample[key] !== "undefined" && key !== fieldKey) {
        updateData[key] = sample[key];

        if (key == "taxonId" || key == "taxonName") {
          sampleValidationObject['object']['taxonomy'][key] = sample[key];
          this.formPathStringMap['.taxonomy.' + key] = this.sampleForm.get(key);
        } else {
          sampleValidationObject['object'][key] = sample[key];
          this.formPathStringMap['.' + key] = this.sampleForm.get(key);
        }
      }
    }

    if (fieldKey == "taxonId" || fieldKey == "taxonName") {
      sampleValidationObject['object']['taxonomy'][fieldKey] = (this.sampleForm.get(fieldKey).value !== "") ? this.sampleForm.get(fieldKey).value : sample[fieldKey];
      this.formPathStringMap['.taxonomy.' + fieldKey] = this.sampleForm.get(fieldKey);
    }


    this.loading = true;
    this.requestsService.createNoAuth(this.validationSchemaUrl, sampleValidationObject).subscribe(
      data => {
        if(data['length'] == 0) {
          // TODO: Clean This!
          this.requestsService.partialUpdate(updateLink, updateData).subscribe(
            data => {
              this.loading = false;
              this.errors = [];
              // Update table data.
              for (let key in updateData) {
                sample[key] = data[key];
              }

              // Hide the input.
              this.onSampleTableClickCell(sample, fieldKey, false);
            },
            err => {
              try {
                let error = JSON.parse(err['_body']);
                this.sampleForm.get(fieldKey).setErrors({
                  'errors': error.errors
                });
                console.log(this.errors);
              } catch (e) {

              }

              this.loading = false;

            }
          )
        } else {
          for(let formItemError in data) {
            this.formPathStringMap[formItemError['dataPath']].setErrors({
              'errors': formItemError['errors']
            });
          }

          this.loading = false;
        }

      },
      err => {
        console.log(err);
        this.loading = false;
      }
    )
  }

  onUpdateSampleAttributes() {
    let updateLink = this.activeSample._links.self.href;
    this.loading = true;

    this.requestsService.update(updateLink, this.activeSample).subscribe(
      data => {
        this.loading = false;
      },
      err => {
        try {
          let error = JSON.parse(err['_body']);
          this.errors = error.errors;
        } catch (e) { }

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

    this.requestsService.get(samplesSheets).subscribe(
      data => {
        try {
          if (data['_embedded']['sheets']['length'] > 0) {
            let tempProcessingSheets = [];

            for (let processingSheet of data['_embedded']['sheets']) {
              if (processingSheet['status'] !== "Completed") {
                tempProcessingSheets.push(processingSheet);
              }
            }
            if (tempProcessingSheets['length'] == 0) {
              this.processingSheets = [];
              this.getSubmissionSamples();
            } else {
              this.processingSheets = tempProcessingSheets;
              let that = this;
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
    )
  }

  onSaveContinue() {
    let samplesData = {};
    samplesData['samplesSource'] = this.samplesForm.value.samplesSource;
    samplesData['samplesSpecies'] = this.samplesForm.value.samplesSpecies;

    this.activeSubmission['uiData']['samples'] = samplesData;
    let submissionUpdateUrl = this.activeSubmission._links['self:update'].href;

    // Update the submission.
    this.requestsService.update(submissionUpdateUrl, this.activeSubmission).subscribe(
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
    this.spreadsheetsService.getTemplatesList().subscribe(
      (data) => {
        try {
          this.templatesList = data['_embedded']['templates'];
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

      this.spreadsheetsService.create(templateUploadLink, fileResults).subscribe(
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

    this.requestsService.get(submissionSamplesLink).subscribe(
      data => {
        this.submittionSamples = data;
        this.loading = false;

        try {
          if (data['_embedded']['samples'] && data['_embedded']['samples']['length'] > 0) {
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
    this.requestsService.get(serviceUrl).subscribe(
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
    this.submissionsService.get(submissionLinksRequestUrl).subscribe(
      (data) => {
        submission._links.contents['_links'] = data['_links'];
        submission['_links']['contents']['dataTypes'] = data['dataTypes'];
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

  createSampleAttrTerm() {
    return this.fb.group({
      term: ''
    })
  }

  addSampleAttrTerm() {
    const control = <FormArray>this.sampleAttributeForm.controls['terms'];
    control.push(this.createSampleAttrTerm());
  }

  removeSampleAttrTerm(i) {
    const control = <FormArray>this.sampleAttributeForm.controls['terms'];
    control.removeAt(i);
  }

  onAddSampleAttribute() {
    if (this.sampleAttributeForm.valid) {
      let sampleAttributeValidationObject = this.initialValidationSchema;
      delete sampleAttributeValidationObject['schema']['required'];
      sampleAttributeValidationObject['object']['attributes'] = {};
      sampleAttributeValidationObject['object']['attributes'][this.sampleAttributeForm.value['name']] = [];

      // If Attribute is not initialized then initialize it.
      if (!this.activeSample['attributes']) {
        this.activeSample['attributes'] = {};
      }

      try {
        this.sampleAttribute["value"] = this.sampleAttributeForm.value['value'];
        this.formPathStringMap['.attributes[\'' + this.sampleAttributeForm.value['name'] + '\'][0].value'] = this.sampleAttributeForm.get('value');
        this.formPathStringMap['.attributes[\'' + this.sampleAttributeForm.value['name'] + '\'][0].name'] = this.sampleAttributeForm.get('name');

        if (this.sampleAttributeForm.value['unit'] && this.sampleAttributeForm.value['unit'] !== "") {
          this.sampleAttribute["units"] = this.sampleAttributeForm.value['unit'];
          this.formPathStringMap['.attributes[\'' + this.sampleAttributeForm.value['name'] + '\'][0].units'] = this.sampleAttributeForm.get('unit');
        }

        if (this.sampleAttributeForm.value['terms'] && this.sampleAttributeForm.value['terms']['length'] > 0) {
          this.sampleAttribute["terms"] = [];

          for (let term of this.sampleAttributeForm.value['terms']) {
            if (term['term']) {
              let termObj = {};
              termObj['url'] = term['term'];
              this.formPathStringMap['.attributes[\'' + this.sampleAttributeForm.value['name'] + '\'][0].terms[' + this.sampleAttribute["terms"]['length'] + '].url'] = this.sampleAttributeForm.get('terms').get(String(this.sampleAttribute["terms"]['length']));
              this.sampleAttribute["terms"].push(termObj);
            }
          }
          if (this.sampleAttribute["terms"].length == 0) {
            delete this.sampleAttribute["terms"];
          }
        }


        sampleAttributeValidationObject['object']['attributes'][this.sampleAttributeForm.value['name']].push(this.sampleAttribute);
        this.loading = true;
        this.requestsService.createNoAuth(this.validationSchemaUrl, sampleAttributeValidationObject).subscribe(
          data => {
            if (data['length'] == 0) {
              this.activeSample['attributes'][this.sampleAttributeForm.value['name']] = [];
              this.activeSample['attributes'][this.sampleAttributeForm.value['name']].push(this.sampleAttribute);

              this.onUpdateSampleAttributes();
              // Close the reveal.
              $(".sample-attribute-close-button").click();
            } else {
              for(let formItemError in data) {
                this.formPathStringMap[formItemError['dataPath']].setErrors({
                  'errors': formItemError['errors']
                });
              }

              this.loading = false;
            }

          },
          err => {
            console.log(err);
            this.loading = false;
          }
        )

      } catch (err) { }
    }
  }

  onAddSampleRelations() {


    if (this.sampleRelationsForm.valid) {
      let sampleRelationValidationObject = this.initialValidationSchema;
      delete sampleRelationValidationObject['schema']['required'];
      sampleRelationValidationObject['object']['sampleRelationships'] = [];

      let sampleRelationSingle = {};

      this.formPathStringMap['.sampleRelationships[0].alias'] = this.sampleRelationsForm.get('alias');
      this.formPathStringMap['.sampleRelationships[0].team'] = this.sampleRelationsForm.get('team');
      this.formPathStringMap['.sampleRelationships[0].nature'] = this.sampleRelationsForm.get('nature');
      this.formPathStringMap['.sampleRelationships[0].accession'] = this.sampleRelationsForm.get('accession');

      // If Attribute is not initialized then initialize it.
      if (!this.activeSample['sampleRelationships']) {
        this.activeSample['sampleRelationships'] = [];
      }

      if (this.sampleRelationsForm.value['method'] == "using-alias") {
        sampleRelationSingle['alias'] = this.sampleRelationsForm.get('alias').value;
        sampleRelationSingle['team'] = this.sampleRelationsForm.get('team').value;
        sampleRelationSingle['nature'] = this.sampleRelationsForm.get('nature').value;
      }

      if (this.sampleRelationsForm.value['method'] == "using-accession") {
        sampleRelationSingle['accession'] = this.sampleRelationsForm.get('accession').value;
        sampleRelationSingle['nature'] = this.sampleRelationsForm.get('nature').value;
      }

      sampleRelationValidationObject['object']['sampleRelationships'].push(sampleRelationSingle);
      this.loading = true;

      this.requestsService.createNoAuth(this.validationSchemaUrl, sampleRelationValidationObject).subscribe(
        data => {
          if(data['length'] == 0) {
            this.activeSample['sampleRelationships'].push(sampleRelationSingle);

            this.onUpdateSampleAttributes();
            // Close the reveal.
            $(".sample-relations-close-button").click();
          } else {
            for (let formItemError in data) {
              this.formPathStringMap[formItemError['dataPath']].setErrors({
                'errors': formItemError['errors']
              });
            }

            this.loading = false;
          }

        },
        err => {
          console.log(err);
          this.loading = false;
        }
      )
    }
  }

  onDeleteSampleAttribute(attributeKey) {
    delete this.activeSample['attributes'][attributeKey];
    this.onUpdateSampleAttributes();
  }

  onDeleteSampleRelation(relationKey) {
    this.activeSample['sampleRelationships'].splice(relationKey, 1);
    this.onUpdateSampleAttributes();
  }

  onEditSampleAttribute(attributeKey) {
    this.resetSampleAttributesForm();
    let sampleTerms = [];
    try {
      if (this.activeSample['attributes'][attributeKey][0]['terms'].length > 0) {
        for (let term of this.activeSample['attributes'][attributeKey][0]['terms']) {
          if (term['url'] && term['url'] !== "") {
            sampleTerms.push({ "term": term['url'] });
            this.addSampleAttrTerm();
          }
        }
      }
    } catch (e) {

      console.log(e);
    }

    this.sampleAttributeForm.patchValue({
      name: attributeKey,
      value: this.activeSample['attributes'][attributeKey][0]['value'],
      unit: this.activeSample['attributes'][attributeKey][0]['units'],
      // terms: sampleTerms
    });
    this.sampleAttributeForm.controls['terms'].patchValue(sampleTerms);
  }

  resetSampleAttributesForm() {
    // Reset Form Values.
    this.sampleAttributeForm = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      unit: [''],
      terms: this.fb.array([])
    });
    this.addSampleAttrTerm();
  }

  onCloseSampleAttributeModal() {
    this.resetSampleAttributesForm();
  }

  onCloseSampleRelationsModal() {
    this.sampleRelationsForm.reset();
    this.sampleRelationsForm.patchValue({
      'method': 'using-alias'
    });
  }

  onChangeRelationMethod() {
    if (this.sampleRelationsForm.value['method'] == "using-alias") {
      this.sampleRelationsForm.get('alias').setValidators([Validators.required]);
      this.sampleRelationsForm.get('team').setValidators([Validators.required]);
      this.sampleRelationsForm.get('accession').clearValidators();

      this.sampleRelationsForm.get('alias').updateValueAndValidity();
      this.sampleRelationsForm.get('team').updateValueAndValidity();
      this.sampleRelationsForm.get('accession').updateValueAndValidity();
    }

    if (this.sampleRelationsForm.value['method'] == "using-accession") {
      this.sampleRelationsForm.get('alias').clearValidators();
      this.sampleRelationsForm.get('team').clearValidators();
      this.sampleRelationsForm.get('accession').setValidators([Validators.required]);


      this.sampleRelationsForm.get('alias').updateValueAndValidity();
      this.sampleRelationsForm.get('team').updateValueAndValidity();
      this.sampleRelationsForm.get('accession').updateValueAndValidity();
    }
  }

  getValueByDotNotation(obj, path) {
    return new Function('_', 'return _.' + path)(obj);
  }

  onSampleTableClickCell(sample, key , show) {
    if(!sample['fields']) {
      sample['fields'] = {};
    }

    if(!sample['fields'][key]) {
      sample['fields'][key] = {};
    }

    if (show) {
      sample['fields'][key]['editMode'] = true;
    } else {
      sample['fields'][key]['editMode'] = false;
    }

  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';

import Uppy from 'uppy/lib/core';
import Dashboard from 'uppy/lib/plugins/Dashboard';
import Tus from 'uppy/lib/plugins/Tus10';
import MetaData from 'uppy/lib/plugins/MetaData';
import GoldenRetriever from 'uppy/lib/plugins/GoldenRetriever';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';

declare var Choices;

@Component({
  selector: 'app-samples-page',
  templateUrl: './samples-page.component.html',
  styleUrls: ['./samples-page.component.scss'],
  providers: [
    SubmissionsService,
    TeamsService
  ]
})
export class SamplesPageComponent implements OnInit {
  samplesForm: FormGroup;
  activeSubmission: any;

  uploadEndpoint  = "http://mac-subs-008:1080/files/";
  uploadUppy : any;

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
    private teamsService: TeamsService
  ) { }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();

    this.samplesForm = new FormGroup({
      samplesSource: new FormControl('', Validators.required),
      samplesSpecies: new FormControl('',  Validators.required),
    });

    this.uploadUppy = Uppy({
      id :this.convertToSlug(this.activeSubmission.name + "-" + this.activeSubmission.projectName + "-samples"),
      autoProceed: true,
      restrictions: {
        // allowedFileTypes: ['text/csv']
      }
    })
    .use(Dashboard, {
      trigger: '.UppyModalOpenerBtn',
      inline: true,
      target: '.uppy-drag-drop',
      note: 'Drag & drop filled out .CSV file'
    })
    .use(GoldenRetriever, {
      serviceWorker: false,
      indexedDB: { maxFileSize: Infinity, maxTotalSize: Infinity },
    })
    .use(Tus, {
      resume: true,
      autoRetry: true,
      endpoint: this.uploadEndpoint
    })
    .use(MetaData, {
      fields: [
        { id: 'license', name: 'License', value: 'Creative Commons', placeholder: 'specify license' },
        { id: 'caption', name: 'Caption', value: 'none', placeholder: 'describe what the image is about' }
      ]
    })
    .run();

    this.uploadUppy.on('core:upload-success', (fileId, url) => {
       // this.formDisabled = false;
    })
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

    this.router.navigate(['/dashboard']);
  }

  onSaveContinue() {
      this.router.navigate(['/submission/protocols']);
  }

  convertToSlug(Text) {
    return Text
      .toLowerCase()
      .replace(/ /g,'-')
      .replace(/[^\w-]+/g,'')
      ;
  }
}

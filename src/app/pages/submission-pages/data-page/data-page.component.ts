import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'angular-aap-auth';

const Uppy = require('uppy/lib/core')
const Dashboard = require('uppy/lib/plugins/Dashboard')
const Tus = require('uppy/lib/plugins/Tus')
const Form = require('uppy/lib/plugins/Form')
const GoldenRetriever = require('uppy/lib/plugins/GoldenRetriever')

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';

declare var $;

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss'],
  providers: [
    SubmissionsService,
    TeamsService,
    TokenService
  ]
})
export class DataPageComponent implements OnInit {
  activeSubmission: any;

  uploadEndpoint  = "http://mac-subs-008:1080/files/";
  uploadUppy : any;

  userHasTeam = true;
  token: string;
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
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    this.token = this.tokenService.getToken();

    this.uploadUppy = Uppy({
      id :this.convertToSlug(this.activeSubmission.name + "-" + this.activeSubmission.projectName + "-data"),
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
    .use(Form, {
      target: ".uppy-metadata",
      getMetaFromForm: true,
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
    .run();

    this.uploadUppy.on('core:upload-success', (fileId, url) => {
       // this.formDisabled = false;
    })

  }


  onSaveExit() {
    this.submissionsService.deleteActiveSubmission();
    this.submissionsService.deleteActiveProject();
    this.teamsService.deleteActiveTeam();

    this.router.navigate(['/dashboard'])
  }

  onSaveContinue() {
    this.router.navigate(['/submission/samples'])
  }

  convertToSlug(Text) {
    return Text
      .toLowerCase()
      .replace(/ /g,'-')
      .replace(/[^\w-]+/g,'')
      ;
  }
}

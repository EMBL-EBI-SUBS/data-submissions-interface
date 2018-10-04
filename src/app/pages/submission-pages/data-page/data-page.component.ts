import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { environment } from '../../../../environments/environment';

import Uppy  from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import Form from '@uppy/form';
import GoldenRetriever from '@uppy/golden-retriever';

declare var $;
declare var require: any;

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

  uploadEndpoint  = environment.uploadEndpoint;
  uploadUppy : any;
  files: any;
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
    this.submissionsService.getActiveSubmissionsFiles().subscribe(
      (data) => {
        this.files = data['_embedded']['files'];
      }
    );
    this.uploadUppy = Uppy({
      id :this.convertToSlug(this.activeSubmission.name + "-" + this.activeSubmission.projectName + "-data"),
      autoProceed: true,
    });

    this.uploadUppy.use(Dashboard, {
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

    this.router.navigate(['/'])
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

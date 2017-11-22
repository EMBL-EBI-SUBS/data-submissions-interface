import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import Uppy from 'uppy/lib/core';
import Dashboard from 'uppy/lib/plugins/Dashboard';
import Tus from 'uppy/lib/plugins/Tus';
import MetaData from 'uppy/lib/plugins/MetaData';
import GoldenRetriever from 'uppy/lib/plugins/GoldenRetriever';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';

declare var $;

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss'],
  providers: [SubmissionsService]
})
export class DataPageComponent implements OnInit {
  activeSubmission: any;

  uploadEndpoint  = "http://mac-subs-008:1080/files/";
  uploadUppy : any;

  formDisabled = true;

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
  ) { }

  /**
   * Initialize Plugin.
   */
  ngAfterViewInit() {
  }

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    this.uploadUppy = Uppy({
      id: this.convertToSlug(this.activeSubmission.name + "-" + this.activeSubmission.projectName + "-data"),
      autoProceed: true,
      restrictions: {
        // allowedFileTypes: ['chemical/seq-na-fastq', 'chemical/seq-aa-fasta', 'chemical/seq-na-fasta', 'BAM', 'CRAM']
      }
    })
    .use(Dashboard, {
      trigger: '.UppyModalOpenerBtn',
      inline: true,
      target: '.uppy-drag-drop',
      note: 'FASTQ, FASTA, CRAM, BAM and ETC files.'
    })
    .use(GoldenRetriever, { serviceWorker: false })
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
      this.formDisabled = false;
    })
  }

  onSaveExit() {

  }

  onSaveContinue() {
    console.log(this.uploadUppy);
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

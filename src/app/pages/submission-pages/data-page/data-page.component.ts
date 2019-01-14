import { NgxSmartModalService } from 'ngx-smart-modal';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { SubmissionsService } from '../../../services/submissions.service';
import { TeamsService } from '../../../services/teams.service';
import { environment } from 'src/environments/environment';

import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import Form from '@uppy/form';
import GoldenRetriever from '@uppy/golden-retriever';
import * as HttpStatus from 'http-status-codes';
import { FileService } from 'src/app/services/file.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements OnInit {

  objectKeys = Object.keys;
  activeSubmission: any;
  uploadEndpoint = environment.uploadEndpoint;
  uploadUppy: any;
  files: any;
  userHasTeam = true;
  token: string;

  selectedFileErrorMessages = {};

  constructor(
    private router: Router,
    private submissionsService: SubmissionsService,
    private teamsService: TeamsService,
    private tokenService: TokenService,
    private requestsService: RequestsService,
    private fileService: FileService,
    private elementRef: ElementRef,
    public ngxSmartModalService: NgxSmartModalService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.activeSubmission = this.submissionsService.getActiveSubmission();
    this.token = this.tokenService.getToken();

    this.fileService.getActiveSubmissionsFiles(this.activeSubmission).subscribe(
      (response) => {
        this.files = response;
      }
    );

    this.initUppy();
  }

  initUppy() {
    this.uploadUppy = Uppy({
      id: this.convertToSlug(
        this.activeSubmission.name +
          '-' +
          this.activeSubmission.projectName +
          '-data'
      ),
      autoProceed: true
    });

    this.uploadUppy
      .use(Dashboard, {
        trigger: '.UppyModalOpenerBtn',
        inline: true,
        target: '.uppy-drag-drop',
        note: 'Drag & drop data files here'
      })
      .use(Form, {
        target: '.uppy-metadata',
        getMetaFromForm: true
      })
      .use(GoldenRetriever, {
        serviceWorker: false,
        indexedDB: { maxFileSize: Infinity, maxTotalSize: Infinity }
      })
      .use(Tus, {
        resume: true,
        autoRetry: true,
        endpoint: this.uploadEndpoint
      })
      .run();

    this.uploadUppy.on('complete', (fileId, url) => {
      if (this.files) {
        this.getSubmissionFilesByUrl(this.files._links['self']['href']);
      }
    });
  }

  onDeleteFile(file: any, index: number) {
    if (
      !confirm(
        `Are you sure you would like to delete this file: ${file.filename}`
      )
    ) {
      return;
    }

    const fileHref = file._links.file.href;

    this.fileService.deleteFile(fileHref).subscribe(
      response => {
        if (response.status === HttpStatus.NO_CONTENT) {
          console.log(`File: ${file.filename} has been succcesfully deleted from the storage.`);
          this.files['_embedded']['files'].splice(index, 1);
          this.changeDetectorRef.detectChanges();
        } else {
          console.log(`File deletion has failed. The reason: ${response.statusText}`);
        }
      },
      err => {
        console.log(
          `File deletion has failed. The reason: ${err.error.title}, message: ${
            err.message
          }`
        );
      }
    );
  }

  onRefreshFileStatuses() {
    this.fileService.getActiveSubmissionsFiles(this.activeSubmission).subscribe(
      (response) => {
        this.files = response;
      }
    );
  }

  /**
   * When click on pager, update files.
   */
  onPagerClick(action: string) {
    const getFilesUrl = this.files._links[action]
      .href;
    this.files = this.getSubmissionFilesByUrl(
      getFilesUrl
    );
  }

    /**
   * Retrieve the new metadata object when pager clicked.
   */
  getSubmissionFilesByUrl(serviceUrl: string) {
    this.requestsService.get(serviceUrl).subscribe(
      data => {
        this.files = data;
        this.changeDetectorRef.detectChanges();
      },
      err => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  showValidationErrors(errorMessages: {}) {
    this.selectedFileErrorMessages = errorMessages;
    this.ngxSmartModalService.getModal('fileErrorWindow').open();
  }

  onSaveExit() {
    this.submissionsService.deleteActiveSubmission();
    this.submissionsService.deleteActiveProject();
    this.teamsService.deleteActiveTeam();

    this.router.navigate(['/']);
  }

  onSaveContinue() {
    this.elementRef.nativeElement
      .querySelector('li.tabs-title.active+li a')
      .click();
  }

  convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  /**
   * Replaces underscores with spaces in given string
   */
  cleanupUnderscores(Text) {
    return Text.replace(/_/g, ' ');
  }

  /**
   * Formats the specified file status text: replace underscores, convert to lowercase, uppercase first letter
   */
  formatFileStatus(Text) {
    return this.cleanupUnderscores(
      Text.charAt(0).toUpperCase() + Text.substr(1).toLowerCase()
    );
  }
}

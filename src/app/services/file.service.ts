import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestsService } from './requests.service';
import { Injectable } from '@angular/core';
import { flatMap, map, pluck } from 'rxjs/operators';

@Injectable()
export class FileService {
  requestService: RequestsService;
  fileEndpoint: any;

  constructor(private _http: HttpClient) {
    this.requestService = new RequestsService(_http);
    this.fileEndpoint = this.getUploadEndpoint();
  }

  getUploadEndpoint() {
    return this.requestService.get(environment.apiHost).pipe(
      pluck('_links', 'tus-upload', 'href')
    );
  }

  deleteFile(fileHref) {
      return this.requestService.delete(fileHref);
  }

  getActiveSubmissionsFiles(activeSubmission) {
    const contentsLinks = activeSubmission['_links']['contents']['href'];
    const response = this.requestService.get(contentsLinks).pipe(
      map(res => {
        return res['_links']['files']['href'];
      }),
      flatMap((filesUrl) => {
        return this.requestService.get(filesUrl);
      }),
      map(res => {
        return res;
      })
    );

    return response;
  }

}

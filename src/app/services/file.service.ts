import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestsService } from './requests.service';
import { Injectable } from '@angular/core';
import * as HttpStatus from 'http-status-codes';

@Injectable()
export class FileService {
    requestService: RequestsService;
    fileEndpoint = environment.uploadEndpoint;

    constructor(private _http: HttpClient) {
        this.requestService = new RequestsService(_http);
    }

    deleteFile(fileHref) {
        this.requestService.delete(fileHref).subscribe(
            (response) => {
                if (response.status === HttpStatus.NO_CONTENT ) {
                    console.log('File has been succcesfully deleted from the storage.');
                } else {
                    console.log('File deletion has failed. The reason: ${response.statusText}');
                }
            },
            (err) => {
              console.log(`File deletion has failed. The reason: ${err.error.title}, message: ${err.message}`);
            }
        );
    }
}

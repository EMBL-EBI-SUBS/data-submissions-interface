import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestsService } from './requests.service';
import { Injectable } from '@angular/core';

@Injectable()
export class FileService {
    requestService: RequestsService;
    fileEndpoint = environment.uploadEndpoint;

    constructor(private _http: HttpClient) {
        this.requestService = new RequestsService(_http);
    }

    deleteFile(fileHref) {
        return this.requestService.delete(fileHref);
    }
}

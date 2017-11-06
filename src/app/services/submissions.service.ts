import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class SubmissionsService {
  variables = new VariablesService;
  listApiEndpoint = this.variables.host + "teams";


  constructor(private http: Http) { }

  static get parameters() {
   return [[Http]];
  }

  /**
   * Get record.
   */
  get(token, url) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  url;
    var response = this.http.get(requestUrl, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * Create new record.
   */
  create(token, url) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  url;
    var response = this.http.post(requestUrl, body, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * Update active submission
   */
  setActiveSubmission(submission: any) {
    localStorage.setItem("submission", JSON.stringify(submission));
  }

  /**
   * Retrieve active submission
   */
  getActiveSubmission() {
    return JSON.parse(localStorage.getItem("submission"));
  }

  /**
   * Delete active submission
   */
  deleteActiveSubmission() {
    localStorage.removeItem("submission");
  }
}

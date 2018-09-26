
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class UserService {
  variables = new VariablesService;
  userTeamsEndpoint = this.variables.host + "user/teams";
  userProjectsEndpoint = this.variables.host + "user/projects";
  userSubmissionsEndpoint = this.variables.host + "user/submissions";
  userSubmissionsSummaryEndpoint = this.variables.host + "user/submissionStatusSummary";

  constructor(private http: Http) { }

  static get parameters() {
   return [[Http]];
  }

  /**
   * List Team Members for Current Logged in user.
   */
  getUserTeams(token: String, options: any = { size: 12, page: 0}) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
      headers: headers
    });

    let requestUrl =  this.userTeamsEndpoint + "?size=" + options.size + "&page=" + options.page;
    var response = this.http.get(requestUrl, requestOptions).pipe(map(res => res.json()));
    return response;
  }

  /**
   * List Projects for Current Logged in user.
   */
  getUserProjects(token: String, options: any = { size: 12, page: 0}) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    let requestUrl =  this.userProjectsEndpoint + "?size=" + options.size + "&page=" + options.page;
    var response = this.http.get(requestUrl, requestOptions).pipe(map(res => res.json()));
    return response;
  }

  /**
   * Get User Submissions.
   */
  geUserSubmissions(token) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  this.userSubmissionsEndpoint;
    var response = this.http.get(requestUrl, requestOptions).pipe(map(res => res.json()));
    return response;
  }

  /**
   * Get User Submissions Summary.
   */
  geUserSubmissionsSummary(token) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  this.userSubmissionsSummaryEndpoint;
    var response = this.http.get(requestUrl, requestOptions).pipe(map(res => res.json()));
    return response;
  }
}

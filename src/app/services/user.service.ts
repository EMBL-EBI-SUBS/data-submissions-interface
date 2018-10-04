
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class UserService {
  variables = new VariablesService;
  userTeamsEndpoint = this.variables.host + "user/teams";
  userProjectsEndpoint = this.variables.host + "user/projects";
  userSubmissionsEndpoint = this.variables.host + "user/submissions";
  userSubmissionsSummaryEndpoint = this.variables.host + "user/submissionStatusSummary";

  constructor(private http: HttpClient) { }

  /**
   * List Team Members for Current Logged in user.
   */
  getUserTeams(options: any = { size: 12, page: 0}) {
    let requestUrl =  this.userTeamsEndpoint + "?size=" + options.size + "&page=" + options.page;
    var response = this.http.get(requestUrl);
    return response;
  }

  /**
   * List Projects for Current Logged in user.
   */
  getUserProjects(options: any = { size: 12, page: 0}) {
    let requestUrl =  this.userProjectsEndpoint + "?size=" + options.size + "&page=" + options.page;
    var response = this.http.get(requestUrl);
    return response;
  }

  /**
   * Get User Submissions.
   */
  geUserSubmissions() {
    let requestUrl =  this.userSubmissionsEndpoint;
    var response = this.http.get(requestUrl);
    return response;
  }

  /**
   * Get User Submissions Summary.
   */
  geUserSubmissionsSummary() {
    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  this.userSubmissionsSummaryEndpoint;
    var response = this.http.get(requestUrl);
    return response;
  }
}

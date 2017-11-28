import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class SubmissionsService {
  variables = new VariablesService;
  dataTypesEndpoint = this.variables.host + "studyDataTypes";

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
   * List Projects for Current Logged in user.
   */
  getDataTypes(token: String) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    let requestUrl =  this.dataTypesEndpoint;
    var response = this.http.get(requestUrl, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * Get Project for Submission.
   */
  getActiveSubmissionProject(token: String) {
    let activeSubmission = this.getActiveSubmission();
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    if(!activeSubmission) {
        return ;
    }

    // If Contents links not exist then retrieve it.
    if (!activeSubmission._links.contents.hasOwnProperty("_links")) {
      let contentsLinks = activeSubmission._links.contents.href;
      var response = this.http.get(contentsLinks, requestOptions)
        .map(res => {
          let response = res.json();
          activeSubmission._links.contents['_links'] = response._links;
          this.setActiveSubmission(activeSubmission);
          return response._links.projects.href;
        })
        .flatMap((projectsUrl) => {
          return this.http.get(projectsUrl, requestOptions);
        })
        .map(res => {
          let response = res.json();
          if(response.hasOwnProperty("_embedded") && response._embedded.hasOwnProperty("projects")) {
            let activeProject = response._embedded.projects.pop();
            return activeProject._links.self.href;
          }
        })
        .flatMap((projectsUrl) => {
          return this.http.get(projectsUrl, requestOptions);
        })
        .map(res => {
          let project = res.json();
          this.setActiveProject(project);
          return project;
        });

      return response;
    }
    else {
      let projectsLinks = activeSubmission._links.contents._links.projects.href;
      var response = this.http.get(projectsLinks, requestOptions)
        .map(res => {
          let response = res.json();
          if(response.hasOwnProperty("_embedded") && response._embedded.hasOwnProperty("projects")) {
            let activeProject = response._embedded.projects.pop();
            return activeProject._links.self.href;
          }
        })
        .flatMap((projectsUrl) => {
          return this.http.get(projectsUrl, requestOptions);
        })
        .map(res => {
          let project = res.json();
          this.setActiveProject(project);
          return project;
        });

      return response;
    }
  }

  /**
   * Update active submission.
   */
  setActiveSubmission(submission: any) {
    localStorage.setItem("active_submission", JSON.stringify(submission));
  }

  /**
   * Retrieve active submission.
   */
  getActiveSubmission() {
    return JSON.parse(localStorage.getItem("active_submission"));
  }

  /**
   * Delete active submission.
   */
  deleteActiveSubmission() {
    localStorage.removeItem("active_submission");
  }

  /**
   * Set all submissions.
   */
  setSubmissions(submissions) {
    localStorage.setItem("submissions", JSON.stringify(submissions));
  }

  /**
   * Retrieve all submissions.
   */
  getSubmissions() {
    return JSON.parse(localStorage.getItem("submissions"));
  }

  /**
   * Delete all submissions.
   */
  deleteSubmissions() {
    localStorage.removeItem("submissions");
  }

  /**
   * Update active project.
   */
  setActiveProject(project: any) {
      localStorage.setItem("active_project", JSON.stringify(project));
  }

  /**
   * Retrieve active project.
   */
  getActiveProject() {
      return JSON.parse(localStorage.getItem("active_project"));
  }

  /**
   * Delete active project.
   */
  deleteActiveProject() {
      localStorage.removeItem("active_project");
  }
}

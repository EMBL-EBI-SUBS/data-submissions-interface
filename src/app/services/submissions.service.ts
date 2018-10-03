import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class SubmissionsService {
  variables = new VariablesService;
  SubmissionPlansEndpoint = this.variables.host + "submissionPlans";

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
  create(token, url, bodyData = {}, requestParam = {}) {
    let headers = this.variables.buildHeader(token);
    let requestOptions = new RequestOptions({
        headers: headers,
        params: requestParam
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify(bodyData);

    let requestUrl =  url;
    var response = this.http.post(requestUrl, body, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * List Projects for Current Logged in user.
   */
  getSubmissionPlansResponse(token: String) {
    const headers = this.variables.buildHeader(token);

    const requestOptions = new RequestOptions({
        headers: headers
    });

    const requestUrl =  this.SubmissionPlansEndpoint;
    const response = this.http.get(requestUrl, requestOptions).map(res => res.json());
    return response;
  }

  getSubmissionPlansUIData(submissionPlans) {
    let submissionPlansUIData = [];
    for (const submissionPlan of submissionPlans) {
      const submissionPlanUIData = {};
      submissionPlanUIData['displayName'] = submissionPlan.displayName;
      submissionPlanUIData['description'] = submissionPlan.description;
      submissionPlanUIData['id'] = submissionPlan.id;

      submissionPlansUIData.push(submissionPlanUIData);
    };

    return submissionPlansUIData;
  }

  getActiveSubmissionsFiles(token: String){
    let activeSubmission = this.getActiveSubmission();
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
      headers: headers
    });

    let contentsLinks = activeSubmission._links.contents.href;
    var response = this.http.get(contentsLinks, requestOptions)
      .map(res => {
        let response = res.json();
        return response._links.files.href;
      })
      .flatMap((filesUrl) => {
        return this.http.get(filesUrl, requestOptions);
      })
      .map(res => {
        let response = res.json();
        return response;
      });
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
          return response._links.project.href;
        })
        .flatMap((projectsUrl) => {
          return this.http.get(projectsUrl, requestOptions);
        })
        .map(res => {
          let response = res.json();
          this.setActiveProject(response);
          return response;
        });

      return response;
    }
    else {
      try {
        let projectsLinks = activeSubmission._links.contents._links.project.href;

        var response = this.http.get(projectsLinks, requestOptions)
          .map(res => {
            let response = res.json();
            if(response.hasOwnProperty("_embedded") && response._embedded.hasOwnProperty("project")) {
              let activeProject = response._embedded.project.pop();
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
      } catch (err) {
        // Return empty reponse variable.
        let emptyVariable: any;
        var response = Observable.of(emptyVariable);
      }


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

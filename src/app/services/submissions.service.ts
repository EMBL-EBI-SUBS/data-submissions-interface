import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class SubmissionsService {
  variables = new VariablesService;
  dataTypesEndpoint = this.variables.host + "studyDataTypes";

  constructor(private http: HttpClient) { }

  static get parameters() {
   return [[HttpClient]];
  }

  /**
   * Get record.
   */
  get(token, url) {
    let headers = this.variables.buildHeader(token);

    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  url;
    var response = this.http.get(requestUrl, headers);
    return response;
  }

  /**
   * Create new record.
   */
  create(token, url, bodyData = {}) {
    let headers = this.variables.buildHeader(token);

    // Post an Empty object to create submission.
    let body = JSON.stringify(bodyData);

    let requestUrl =  url;
    var response = this.http.post(requestUrl, body, headers);
    return response;
  }

  /**
   * List Projects for Current Logged in user.
   */
  getDataTypes(token: String) {
    let headers = this.variables.buildHeader(token);

    let requestUrl =  this.dataTypesEndpoint;
    var response = this.http.get(requestUrl, headers);
    return response;
  }

  getActiveSubmissionsFiles(token: String){
    let activeSubmission = this.getActiveSubmission();
    let headers = this.variables.buildHeader(token);

    let contentsLinks = activeSubmission._links.contents.href;
    var response = this.http.get(contentsLinks, headers).pipe(
      map(res => {
        return response._links.files.href;
      }),
      flatMap((filesUrl) => {
        return this.http.get(filesUrl, headers);
      }),
      map(res => {
        return response;
      })
    );
    return response;
  }

  /**
   * Get Project for Submission.
   */
  getActiveSubmissionProject(token: String) {
    let activeSubmission = this.getActiveSubmission();
    let headers = this.variables.buildHeader(token);

    if(!activeSubmission) {
        return ;
    }
    // If Contents links not exist then retrieve it.
    if (!activeSubmission._links.contents.hasOwnProperty("_links")) {
      let contentsLinks = activeSubmission._links.contents.href;
      var response = this.http.get(contentsLinks, headers).pipe(
        map(res => {
          activeSubmission._links.contents['_links'] = response._links;
          this.setActiveSubmission(activeSubmission);
          return response._links.project.href;
        }),
        flatMap((projectsUrl) => {
          return this.http.get(projectsUrl, headers);
        }),
        map(res => {
          this.setActiveProject(response);
          return response;
        })
      );

      return response;
    }
    else {
      try {
        let projectsLinks = activeSubmission._links.contents._links.project.href;

        let response = this.http.get(projectsLinks, headers).pipe(
          map(response => {
            if(response.hasOwnProperty("_embedded") && response['_embedded'].hasOwnProperty("project")) {
              let activeProject = response['._embedded'].project.pop();
              return activeProject._links.self.href;
            }
          }),
          flatMap((projectsUrl) => {
            return this.http.get(projectsUrl, headers);
          }),
          map(project => {
            this.setActiveProject(project);
            return project;
          })
        );
      } catch (err) {
        // Return empty reponse variable.
        let emptyVariable: any;
        response = Observable.of(emptyVariable);
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

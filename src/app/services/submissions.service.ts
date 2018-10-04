import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class SubmissionsService {
  variables = new VariablesService;
  SubmissionPlansEndpoint = this.variables.host + "submissionPlans";

  constructor(private http: HttpClient) { }

  /**
   * Get record.
   */
  get(token, url) {
    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  url;
    var response = this.http.get(requestUrl);
    return response;
  }

  /**
   * Create new record.
   */
  create(token, url, bodyData = {}, requestParam = {}) {
    const httpParams = new HttpParams();
    for (const key in requestParam) {
      if (requestParam.hasOwnProperty(key)) {
        httpParams.append(key, requestParam[key]);
      }
    }

    // Post an Empty object to create submission.
    const body = JSON.stringify(bodyData);

    const requestUrl =  url;
    const response = this.http.post(
      requestUrl,
      body,
      { params: httpParams }
    );
    return response;
  }

  /**
   * List Projects for Current Logged in user.
   */
  getSubmissionPlansResponse(token: String) {

    const requestUrl =  this.SubmissionPlansEndpoint;
    const response = this.http.get(requestUrl);
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
    let contentsLinks = activeSubmission['_links']['contents']['href'];
    var response = this.http.get(contentsLinks).pipe(
      map(res => {
        return res['_links']['files']['href'];
      }),
      flatMap((filesUrl) => {
        return this.http.get(filesUrl);
      }),
      map(res => {
        return res;
      })
    );

    return response;
  }

  /**
   * Get Project for Submission.
   */
  getActiveSubmissionProject(token: String) {
    let activeSubmission = this.getActiveSubmission();

    if(!activeSubmission) {
        return ;
    }
    // If Contents links not exist then retrieve it.
    if (!activeSubmission._links.contents.hasOwnProperty("_links")) {
      let contentsLinks = activeSubmission['_links']['contents']['href'];
      var response = this.http.get(contentsLinks).pipe(
        map(res => {
          activeSubmission._links.contents['_links'] = response['_links'];
          this.setActiveSubmission(activeSubmission);
          return response['_links']['project']['href'];
        }),
        flatMap((projectsUrl) => {
          return this.http.get(projectsUrl);
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
        let projectsLinks = activeSubmission['_links']['contents']['_links']['project']['href'];

        let response = this.http.get(projectsLinks).pipe(
          map(response => {
            if(response.hasOwnProperty("_embedded") && response['_embedded'].hasOwnProperty("project")) {
              let activeProject = response['._embedded'].project.pop();
              return activeProject['_links']['self']['href'];
            }
          }),
          flatMap((projectsUrl) => {
            return this.http.get(projectsUrl);
          }),
          map(project => {
            this.setActiveProject(project);
            return project;
          })
        );
      } catch (err) {
        // Return empty reponse variable.
        let emptyVariable: any;
        response = of(emptyVariable);
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

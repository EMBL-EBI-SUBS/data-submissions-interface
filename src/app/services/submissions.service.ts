import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { flatMap, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs'


// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class SubmissionsService {
  variables = new VariablesService;
  SubmissionPlansEndpoint = this.variables.host + 'submissionPlans';

  constructor(private http: HttpClient) { }

  /**
   * Get record.
   */
  get(requestUrl) {
    return this.http.get(requestUrl);
  }

  /**
   * Create new record.
   */
  create(url, bodyData = {}, requestParam = {}) {
    let httpParams = new HttpParams();
    for (const key in requestParam) {
      if (requestParam.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, requestParam[key]);
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
  getSubmissionPlansResponse() {
    const requestUrl =  this.SubmissionPlansEndpoint;
    const response = this.http.get(requestUrl);
    return response;
  }

  getSubmissionPlansUIData(submissionPlans) {
    const submissionPlansUIData = [];
    for (const submissionPlan of submissionPlans) {
      const submissionPlanUIData = {};
      submissionPlanUIData['displayName'] = submissionPlan.displayName;
      submissionPlanUIData['description'] = submissionPlan.description;
      submissionPlanUIData['id'] = submissionPlan.id;
      submissionPlanUIData['href'] = submissionPlan._links.self.href;

      submissionPlansUIData.push(submissionPlanUIData);
    };

    return submissionPlansUIData;
  }

  getActiveSubmissionsFiles() {
    const activeSubmission = this.getActiveSubmission();
    const contentsLinks = activeSubmission['_links']['contents']['href'];
    const response = this.http.get(contentsLinks).pipe(
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
  getActiveSubmissionProject() {
    const activeSubmission = this.getActiveSubmission();

    if (!activeSubmission) {
      return EMPTY;
    }
    // If Contents links not exist then retrieve it.
    if (!activeSubmission['_links']['contents']['_links']) {
      const contentsLinks = activeSubmission['_links']['contents']['href'];

      return this.http.get(contentsLinks).pipe(
        map(res => {
          activeSubmission._links.contents['_links'] = res['_links'];
          this.setActiveSubmission(activeSubmission);
          return res['_links']['projects']['href'];
        }),
        flatMap((projectsUrl) => {
          return this.http.get(projectsUrl);
        }),
        map(res => {
          this.setActiveProject(res);
          return res;
        })
      );
    } else {
      let projectsLinks = '';

      try {
        projectsLinks = activeSubmission['_links']['contents']['_links']['projects']['href'];
      } catch (err) { }

      return this.http.get(projectsLinks).pipe(
        map(response => {
          if (response['_embedded']['projects']) {
            const activeProject = response['_embedded']['projects'][0];
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
    }
  }

  /**
   * Update active submission.
   */
  setActiveSubmission(submission: any) {
    localStorage.setItem('active_submission', JSON.stringify(submission));
  }

  /**
   * Retrieve active submission.
   */
  getActiveSubmission() {
    return JSON.parse(localStorage.getItem('active_submission'));
  }

  /**
   * Delete active submission.
   */
  deleteActiveSubmission() {
    localStorage.removeItem('active_submission');
  }

  /**
   * Set all submissions.
   */
  setSubmissions(submissions) {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }

  /**
   * Retrieve all submissions.
   */
  getSubmissions() {
    return JSON.parse(localStorage.getItem('submissions'));
  }

  /**
   * Delete all submissions.
   */
  deleteSubmissions() {
    localStorage.removeItem('submissions');
  }

  /**
   * Update active project.
   */
  setActiveProject(project: any) {
    localStorage.setItem('active_project', JSON.stringify(project));
  }

  /**
   * Retrieve active project.
   */
  getActiveProject() {
    return JSON.parse(localStorage.getItem('active_project'));
  }

  /**
   * Delete active project.
   */
  deleteActiveProject() {
    localStorage.removeItem('active_project');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';

// Import Service Variables.
import { VariablesService } from './variables.service';
import { of } from 'rxjs';

@Injectable()
export class SubmissionsService {
  variables = new VariablesService;
  dataTypesEndpoint = this.variables.host + "studyDataTypes";

  constructor(private http: HttpClient) { }

  /**
   * Get record.
   */
  get(url) {
    let requestUrl =  url;
    var response = this.http.get(requestUrl);
    return response;
  }

  /**
   * Create new record.
   */
  create(url, bodyData = {}) {
    // Post an Empty object to create submission.
    let body = JSON.stringify(bodyData);

    let requestUrl =  url;
    var response = this.http.post(requestUrl, body);
    return response;
  }

  /**
   * List Projects for Current Logged in user.
   */
  getDataTypes() {
    let requestUrl =  this.dataTypesEndpoint;
    var response = this.http.get(requestUrl);
    return response;
  }

  getActiveSubmissionsFiles(){
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
  getActiveSubmissionProject() {
    let activeSubmission = this.getActiveSubmission();

    if(!activeSubmission) {
        return ;
    }
    // If Contents links not exist then retrieve it.
    if (!activeSubmission._links.contents.hasOwnProperty("_links")) {
      let contentsLinks = activeSubmission['_links']['contents']['href'];
      var response = this.http.get(contentsLinks).pipe(
        map(res => {
          activeSubmission._links.contents['_links'] = res['_links'];
          this.setActiveSubmission(activeSubmission);
          return res['_links']['project']['href'];
        }),
        flatMap((projectsUrl) => {
          return this.http.get(projectsUrl);
        }),
        map(res => {
          this.setActiveProject(res);
          return res;
        })
      );

      return response;
    }
    else {
      try {
        let projectsLinks = activeSubmission['_links']['contents']['_links']['project']['href'];

        this.http.get(projectsLinks).pipe(
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

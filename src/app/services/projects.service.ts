import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class ProjectsService {
  variables = new VariablesService;
  projectsListEndpoint = this.variables.host + "user/projects";

  constructor(private http: Http) { }

  static get parameters() {
   return [[Http]];
  }


  /**
   * List Projects for Current Logged in user.
   */
  getProjectsList(token: String) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    let requestUrl =  this.projectsListEndpoint;
    var response = this.http.get(requestUrl, requestOptions).map(res => res.json());
    return response;
  }
}

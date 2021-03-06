
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class ProjectsService {
  variables = new VariablesService;
  projectsListEndpoint = this.variables.host + 'user/projects';

  constructor(private http: HttpClient) { }

  /**
   * List Projects for Current Logged in user.
   */
  getProjectsList() {
    const requestUrl = this.projectsListEndpoint;
    const response = this.http.get(requestUrl);
    return response;
  }
}

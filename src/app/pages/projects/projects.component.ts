import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'angular-aap-auth';
import { ProjectsService } from '../../services/projects.service';
import { RequestsService } from '../../services/requests.service';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsPageComponent implements OnInit {
  token: string;
  projects: any;

  constructor(
    public authService: AuthService,
    private projectsService: ProjectsService,
    private requestsService: RequestsService,
  ) { }

  ngOnInit() {
    // Get all submissions.
    if (!this.projects) {
      this.getUserProjects();
    }
  }

  getUserProjects() {
    this.projectsService.getProjectsList().subscribe(
      (data) => {
        // Store active submission in a local variable.
        this.projects = data;
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  /**
   * Loop across the teams and get submissions for each team and put it in array.
   */
  getUserProjectsByUrl(serviceUrl) {
    this.requestsService.get(serviceUrl).subscribe(
      (data) => {
        // Store active submission in a local variable.
        this.projects = data;
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  /**
 * When click on pager, update submissions.
 */
  onPagerClick(action: string) {
    const getProjectUrl = this.projects._links[action].href;
    this.projects = this.getUserProjectsByUrl(getProjectUrl);
  }

  onDeleteProject(projectItem: any) {
    const deleteLinkEndpoint = projectItem._links['self:delete'].href;
    this.requestsService.delete(deleteLinkEndpoint).subscribe(
      (data) => {
        // Update submissions list.
        this.projects._embedded.projects = this.projects._embedded.projects.filter(obj => obj !== projectItem);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  onCreateNewProject() {

  }
}

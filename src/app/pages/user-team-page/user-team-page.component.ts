import { Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'angular-aap-auth';
import { concatMap } from 'rxjs/operators';

// Import Services.
import { TeamsService } from '../../services/teams.service';
import { EndpointService } from '../../services/endpoint.service';
import { RequestsService } from '../../services/requests.service';
import { SubmissionsService } from '../../services/submissions.service';

@Component({
  selector: 'app-user-team-page',
  templateUrl: './user-team-page.component.html',
  styleUrls: ['./user-team-page.component.scss'],
})
export class UserTeamPageComponent implements OnInit {
  teams = {};
  private tokenListener: Function;
  token: string;
  constructor(
    public renderer: Renderer,
    public authService: AuthService,
    private _endpointService: EndpointService,
    public requestsService: RequestsService,
    public teamsService: TeamsService,
    public submissionsService: SubmissionsService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this._endpointService.find('userTeams').pipe(
      concatMap(url => this.requestsService.get(url))
    ).subscribe(
      data => {
        this.teams = data;
      },
      err => {
        // TODO: Handle Errros.
      }
    );
  }

  onCreateTeamSubmission(team) {
    this.teamsService.setActiveTeam(team);
    this.submissionsService.deleteActiveProject();
    this.submissionsService.deleteActiveSubmission();
    this.router.navigate(['submission/overview']);
  }

  onCreateTeam() {
    this.router.navigate(['/user/teams/create']);
  }

  /**
   * Loop across the teams and get submissions for each team and put it in array.
   */
  getTeamsByUrl(serviceUrl) {
    this.requestsService.get(serviceUrl).subscribe(
      data => {
        this.teams = data;
      },
      err => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  /**
   * When click on pager, update submissions.
   * @param {string} action
   */
  onPagerClick(action: string) {
    const getTeamsUrl = this.teams['_links'][action].href;
    this.getTeamsByUrl(getTeamsUrl);
  }
}

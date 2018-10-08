import { Component, OnInit, Renderer } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "angular-aap-auth";
import { TokenService } from "angular-aap-auth";

// Import Services.
import { UserService } from "../../services/user.service";
import { TeamsService } from "../../services/teams.service";
import { EndpointService } from "../../services/endpoint.service";
import { RequestsService } from "../../services/requests.service";

@Component({
  selector: "app-user-team-page",
  templateUrl: "./user-team-page.component.html",
  styleUrls: ["./user-team-page.component.scss"],
  providers: [
    AuthService,
    UserService,
    TeamsService,
    EndpointService,
    RequestsService
  ]
})
export class UserTeamPageComponent implements OnInit {
  teams = {};
  private tokenListener: Function;
  token: string;
  userteamsEndpoint = "";
  constructor(
    public renderer: Renderer,
    public authService: AuthService,
    public endpointService: EndpointService,
    public requestsService: RequestsService
  ) {}

  async ngOnInit() {
    this.userteamsEndpoint = await this.endpointService.find("userTeams");
    this.initializeData();
  }

  initializeData() {
    this.requestsService.get(this.userteamsEndpoint).subscribe(
      data => {
        this.teams = data;
      },
      err => {
        // TODO: Handle Errros.
      }
    );
  }

  onCreateTeamSubmission(team) {}

  onCreateTeam() {}

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
    let getTeamsUrl = this.teams["_links"][action].href;
    this.getTeamsByUrl(getTeamsUrl);
  }
}

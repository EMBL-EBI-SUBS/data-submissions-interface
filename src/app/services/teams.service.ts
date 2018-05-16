import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class TeamsService {
  variables = new VariablesService;
  teamEndpoint = this.variables.host + "teams/";
  createTeamEndPoint = this.variables.host + "user/teams";

  constructor(
    private http: Http
    ) { }

  static get parameters() {
   return [[Http]];
  }

  /**
   * Set Teams.
   */
  setTeams(teams: any) {
    localStorage.setItem("teams", JSON.stringify(teams));
  }

  /**
   * Get Teams.
   */
  getTeams() {
    return JSON.parse(localStorage.getItem("teams"));
  }

  /**
   * Delete Teams.
   */
  deleteTeams() {
    localStorage.removeItem("teams");
  }

  /**
   * Get Team by name.
   */
  getTeam(token, name) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  this.teamEndpoint + name;
    var response = this.http.get(requestUrl, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * Create Team for User.
   */
  createTeam(token) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify({
      "description" : "My lab group",
      "centreName" : "An Institute"
    });

    let requestUrl =  this.createTeamEndPoint;
    var response = this.http.post(requestUrl, body, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * Add User to Team.
   */
  addUserToTeam(token, teamDomainRef, userRef) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  this.createTeamEndPoint + "/" + teamDomainRef + "/" +  userRef + "/user";
    var response = this.http.put(requestUrl, body, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * Set Active Team.
   */
  setActiveTeam(team: any) {
    localStorage.setItem("active_team", JSON.stringify(team));
  }

  /**
   * Get Active Team.
   */
  getActiveTeam() {
    let teams = JSON.parse(localStorage.getItem("active_team"));
    return teams[0];
  }

  /**
   * Delete Active Team.
   */
  deleteActiveTeam() {
      localStorage.removeItem("active_team");
  }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class TeamsService {
  variables = new VariablesService;
  teamEndpoint = this.variables.host + 'teams/';
  createTeamEndPoint = this.variables.host + 'user/teams';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Set Teams.
   */
  setTeams(teams: any) {
    localStorage.setItem('teams', JSON.stringify(teams));
  }

  /**
   * Get Teams.
   */
  getTeams() {
    return JSON.parse(localStorage.getItem('teams'));
  }

  /**
   * Delete Teams.
   */
  deleteTeams() {
    localStorage.removeItem('teams');
  }

  /**
   * Get Team by name.
   */
  getTeam(name) {
    const requestUrl = this.teamEndpoint + name;
    const response = this.http.get(requestUrl);
    return response;
  }

  /**
   * Create Team for User.
   */
  createTeam() {
    // Post an Empty object to create submission.
    const body = JSON.stringify({
      'description': 'My lab group',
      'centreName': 'An Institute'
    });

    const requestUrl = this.createTeamEndPoint;
    const response = this.http.post(requestUrl, body);
    return response;
  }

  /**
   * Add User to Team.
   */
  addUserToTeam(teamDomainRef, userRef) {
    // Post an Empty object to create submission.
    const body = JSON.stringify({});

    const requestUrl = this.createTeamEndPoint + '/' + teamDomainRef + '/' + userRef + '/user';
    const response = this.http.put(requestUrl, body);
    return response;
  }

  /**
   * Set Active Team.
   */
  setActiveTeam(team: any) {
    localStorage.setItem('active_team', JSON.stringify(team));
  }

  /**
   * Get Active Team.
   */
  getActiveTeam() {
    const teams = JSON.parse(localStorage.getItem('active_team'));
    return teams[0];
  }

  /**
   * Delete Active Team.
   */
  deleteActiveTeam() {
    localStorage.removeItem('active_team');
  }
}

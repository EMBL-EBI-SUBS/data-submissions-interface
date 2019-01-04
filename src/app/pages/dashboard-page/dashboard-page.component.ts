import { Component, OnInit } from '@angular/core';
import { AuthService } from 'angular-aap-auth';
import { Router } from '@angular/router';

import { TeamsService } from '../../services/teams.service';
import { SubmissionsService } from '../../services/submissions.service';
import { RequestsService } from '../../services/requests.service';
import { UserService } from '../../services/user.service';
import { SpreadsheetsService } from '../../services/spreadsheets.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  submissions: any;
  submissionsSummary: any;

  constructor(
    public authService: AuthService,
    private submissionsService: SubmissionsService,
    private spreadsheetsService: SpreadsheetsService,
    private teamService: TeamsService,
    private requestsService: RequestsService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.submissionsService.deleteActiveProject();
    this.submissionsService.deleteActiveSubmission();
    this.spreadsheetsService.deleteActiveSpreadsheet();
    this.teamService.deleteActiveTeam();

    // Get all submissions.
    if (!this.submissions) {
      this.getUserSubmissions();
    }

    // Get submissions summary.
    if (!this.submissionsSummary) {
      this.getUserSubmissionsSummary();
    }
  }

  onStartSubmission() {
    this.router.navigate(['/user/teams']);
  }


  /**
   * Loop across the teams and get submissions for each team and put it in array.
   */
  getUserSubmissionsByUrl(serviceUrl) {
    this.submissionsService.get(serviceUrl).subscribe(
      (data) => {
        // Store active submission in a local variable.
        this.submissions = data;
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  /**
   * Get User submissions.
   */
  getUserSubmissions() {
    this.userService.getUserSubmissions().subscribe(
      (data) => {
        // Store active submission in a local variable.
        this.submissions = data;
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  /**
   * Get User submissions summary.
   */
  getUserSubmissionsSummary() {
    this.userService.geUserSubmissionsSummary().subscribe(
      (data) => {
        // Store active submission in a local variable.
        this.submissionsSummary = data;
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
    const getSubmissionUrl = this.submissions._links[action].href;
    this.submissions = this.getUserSubmissionsByUrl(getSubmissionUrl);
  }

  onEditSubmission(submissionItem: any) {
    const submissionLinkEndpoint = submissionItem._links['self'].href;
    this.requestsService.get(submissionLinkEndpoint).subscribe(
      (data) => {
        this.submissionsService.setActiveSubmission(data);
        this.teamService.setActiveTeam(data['team']);
        this.router.navigate(['/submission/overview']);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  onViewCompletedSubmission(submissionItem: any) {

  }

  onDeleteSubmission(submissionItem: any) {
    if (!confirm(`Are you sure you would like to delete this submission: ${submissionItem.name}`)) {
      return;
    }

    const deleteLinkEndpoint = submissionItem._links['self:delete'].href;
    this.requestsService.delete(deleteLinkEndpoint).subscribe(
      (data) => {
        // Update submissions list.
        this.submissions._embedded.submissions = this.submissions._embedded.submissions.filter(obj => obj !== submissionItem);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }
}

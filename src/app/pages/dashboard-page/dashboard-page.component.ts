import { Component, OnInit } from '@angular/core';
import { AuthService, TokenService } from 'angular-aap-auth';
import { Router } from '@angular/router';

// Import Services.
import { TeamsService } from '../../services/teams.service';
import { SubmissionsService } from '../../services/submissions.service';
import { RequestsService } from '../../services/requests.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [
    AuthService,
    TokenService,
    TeamsService,
    SubmissionsService,
    RequestsService,
    UserService,
  ]
})
export class DashboardPageComponent implements OnInit {
  token: string;
  submissions: any;
  submissionsSummary: any;

  constructor(
    public authService: AuthService,
    private submissionsService: SubmissionsService,
    private teamService: TeamsService,
    private requestsService: RequestsService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    this.submissionsService.deleteActiveProject();
    this.submissionsService.deleteActiveSubmission();
    this.teamService.deleteActiveTeam();

    // Get all submissions.
    if(!this.submissions) {
      this.getUserSubmissions();
    }

    // Get submissions summary.
    if(!this.submissionsSummary) {
      this.getUserSubmissionsSummary();
    }
  }

  onStartSubmission() {
    this.router.navigate(["/submission"]);
  }


  /**
   * Loop across the teams and get submissions for each team and put it in array.
   */
  getUserSubmissionsByUrl(serviceUrl) {
    this.submissionsService.get(this.token, serviceUrl).subscribe (
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
    this.userService.geUserSubmissions(this.token).subscribe (
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
    this.userService.geUserSubmissionsSummary(this.token).subscribe (
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
   * @param {string} action
   */
  onPagerClick(action: string) {
    let getSubmissionUrl = this.submissions._links[action].href;
    this.submissions = this.getUserSubmissionsByUrl(getSubmissionUrl);
  }

  onEditDraftSubmission(submissionItem: any) {
    let submissionLinkEndpoint = submissionItem._links['self'].href;
    this.requestsService.get(this.token, submissionLinkEndpoint).subscribe (
      (data) => {
        this.submissionsService.setActiveSubmission(data);
        this.teamService.setActiveTeam(data.team);
        this.router.navigate(['/submission/overview']);
      },
      (err) => {
        // TODO: Handle Errors.
        console.log(err);
      }
    );
  }

  onEditSubmittedSubmission(submissionItem: any) {

  }

  onViewCompletedSubmission(submissionItem: any) {

  }

  onDeleteSubmission(submissionItem: any) {
    let deleteLinkEndpoint = submissionItem._links['self:delete'].href;
    this.requestsService.delete(this.token, deleteLinkEndpoint).subscribe (
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

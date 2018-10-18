import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, pluck, filter } from 'rxjs/operators';

import { UserService } from '../../../services/user.service';
import { TeamsService } from '../../../services/teams.service';
import { SubmissionsService } from '../../../services/submissions.service';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
})
export class OverviewPageComponent implements OnInit {
  public overviewForm = this._fb.group({
    uiData: this._fb.group({
      gdpr: ['', Validators.required],
      human: ['', Validators.required],
      controlled: ['', Validators.required],
      submissionPlan: ['', Validators.required],
    }),
    name: ['', Validators.required],
  });
  public activeSubmission;
  public submissionPlans;
  public locked = false;
  public lockedPlan = false;

  private _activeTeam;

  constructor(
    private userService: UserService,
    private teamsService: TeamsService,
    private submissionsService: SubmissionsService,
    private requestsService: RequestsService,
    private router: Router,
    private _fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this._getUserTeams();
    this._getSubmissionPlans();
    this._getActiveSubmission();

    if (this.activeSubmission) {
      this.locked = this.lockedPlan = true;
      this._setFormDefaultValue();
      this._getSubmissionContents(this.activeSubmission);
    }
  }

  public onChangeField(): void {
    const message = 'You are about to modify an important value. Are you sure?';
    window.confirm(message);
    this.lockedPlan = false;
  }

  public onSaveExit(): void {
    this._partialUpdate().subscribe(
      data => {
        this.submissionsService.deleteActiveSubmission();
        this.submissionsService.deleteActiveProject();
        this.teamsService.deleteActiveTeam();

        this.router.navigate(['/dashboard']);
      },
    );
  }

  public onSaveContinue(): void {
    this._partialUpdate().subscribe(
      data => {
        this._getSubmissionContents(data);
        this._getActiveSubmission();

        this.router.navigate(['/submission/project']);
      },
    );
  }

  public showPlanName(): string {
    try {
      const planUrl = this.overviewForm.get('uiData.submissionPlan').value;
      return ` ${this.submissionPlans.filter( plan => plan.href === planUrl)[0]['displayName']} `;
    } catch (error) {
      return ' Unknown ';
    }
  }

  private _partialUpdate(): Observable<any> {
    if (this.activeSubmission) {
      const updateSubmissionUrl = this.activeSubmission._links['self:update'].href;
      return this.requestsService.partialUpdate(updateSubmissionUrl, this.overviewForm.value).pipe(
        tap(data => {
            // Save Updated Submission to the Session.
            this.submissionsService.deleteActiveSubmission();
            this.submissionsService.setActiveSubmission(data);
        }),
      );
    } else {
      const createSubmissionUrl = this._activeTeam._links['submissions:create'].href;
      return this.submissionsService.create(createSubmissionUrl, this.overviewForm.value).pipe(
        tap(data => this.submissionsService.setActiveSubmission(data)),
      );
    }
  }

  /**
   * Set Form Default Value.
   */
  private _setFormDefaultValue(): void {
    this.overviewForm.patchValue(this.activeSubmission);
  }

  /**
   * Get submissions from local storage
   */
  private _getActiveSubmission(): void {
    const getActiveSubmission = this.submissionsService.getActiveSubmission();

    if (getActiveSubmission) {
      this.activeSubmission = getActiveSubmission;
    }
  }

  /**
   * Get Submission Content.
   */
  private _getSubmissionContents(submission: any): void {
     const submissionLinksRequestUrl = submission._links.contents.href;
     this.submissionsService.get(submissionLinksRequestUrl).subscribe (
       data => {
         submission['_links']['contents']['_links'] = data['_links'];
         submission['_links']['contents']['dataTypes'] = data['dataTypes'];
         this.submissionsService.setActiveSubmission(submission);
         this.activeSubmission = submission;
        },
     );
  }

  /**
   * Get User Teams.
   */
  private _getUserTeams(): void {
    this.userService.getUserTeams().pipe(
      pluck('_embedded', 'teams'),
      filter(teams => teams !== undefined),
    ).subscribe (
      teams => {
        // TODO: Currently we set the first team as default one. We have to change this later on.
        if (teams[0].name) {
          this._setActiveTeam(teams[0].name);
        }
      },
    );
  }

  /**
   * On Change / Select the team.
   * Set active team.
   */
  private _setActiveTeam(name): void {
    this.teamsService.getTeam(name).subscribe (
      data => {
        this._activeTeam = data;
        this.teamsService.setActiveTeam(data);
      },
    );
  }

  /**
   * Retrieve list of submission plans.
   */
  private _getSubmissionPlans(): void {
    this.submissionsService.getSubmissionPlansResponse().pipe(
      pluck('_embedded', 'submissionPlans'),
      tap(plans => this.submissionPlans = this.submissionsService.getSubmissionPlansUIData(plans))
    ).subscribe();
  }
}

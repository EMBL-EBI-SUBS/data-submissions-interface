import { Component, OnInit, Renderer } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "angular-aap-auth";
import { concatMap } from 'rxjs/operators';

// Import Services.
import { UserService } from "../../services/user.service";
import { TeamsService } from "../../services/teams.service";
import { EndpointService } from "../../services/endpoint.service";
import { RequestsService } from "../../services/requests.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-user-team-create-page",
  templateUrl: "./user-team-create-page.component.html",
  styleUrls: ["./user-team-create-page.component.scss"],
})
export class UserTeamCreatePageComponent implements OnInit {
  public teams = {};
  private tokenListener: Function;
  public token: string;
  public teamCreateForm = new FormGroup({
      centreName: new FormControl('', Validators.required),
      description: new FormControl(''),
    });

  constructor(
    public renderer: Renderer,
    public authService: AuthService,
    private _endpointService: EndpointService,
    public requestsService: RequestsService,
    public router: Router,
  ) {}

  ngOnInit() {}

  onCreateTeam() {
    this._endpointService.find('userTeams').pipe(
      concatMap(url => this.requestsService.create(url, this.teamCreateForm.value))
    ).subscribe(
      data => {
        this.doRefreshToken();
      }
    );
  }

  doRefreshToken() {
    this.requestsService.get(environment.authenticationHost + "/token", {responseType: 'text'}).subscribe(
      (data) => {
        let retrievedToken = data.toString();
        // Updating the token with a new one.
        localStorage.setItem('jwt_token', retrievedToken);
        this.onExit();
      }
    );
  }

  onExit() {
    this.router.navigate(["/user/teams"]);
  }

}

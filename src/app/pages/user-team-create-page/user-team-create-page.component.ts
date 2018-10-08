import { Component, OnInit, Renderer } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "angular-aap-auth";
import { TokenService } from "angular-aap-auth";

// Import Services.
import { UserService } from "../../services/user.service";
import { TeamsService } from "../../services/teams.service";
import { EndpointService } from "../../services/endpoint.service";
import { RequestsService } from "../../services/requests.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: "app-user-team-create-page",
  templateUrl: "./user-team-create-page.component.html",
  styleUrls: ["./user-team-create-page.component.scss"],
  providers: [
    AuthService,
    UserService,
    TeamsService,
    EndpointService,
    RequestsService
  ]
})
export class UserTeamCreatePageComponent implements OnInit {
  teams = {};
  private tokenListener: Function;
  token: string;
  userteamsEndpoint = "";
  teamCreateForm : FormGroup;
  constructor(
    public renderer: Renderer,
    public authService: AuthService,
    public endpointService: EndpointService,
    public requestsService: RequestsService,
    public router: Router,
  ) {}

  async ngOnInit() {
    this.teamCreateForm = new FormGroup({
      centreName: new FormControl('', Validators.required),
      description: new FormControl(''),
    });

    this.userteamsEndpoint = await this.endpointService.find("userTeams");
  }
  onCreateTeam() {
    this.requestsService.create(this.userteamsEndpoint, this.teamCreateForm.value).subscribe(
      data => {
        this.onExit();
      }
    );
  }

  onExit() {
    this.router.navigate(["/user/teams"]);
  }

}

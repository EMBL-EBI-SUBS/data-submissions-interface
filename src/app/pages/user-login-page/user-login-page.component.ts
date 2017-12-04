import { Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'angular-aap-auth';
import { TokenService } from 'angular-aap-auth';
import { JwtHelper } from 'angular2-jwt';


// Import Services.
import { UserService } from '../../services/user.service';
import { TeamsService } from '../../services/teams.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './user-login-page.component.html',
  styleUrls: ['./user-login-page.component.scss'],
  providers: [
    AuthService,
    UserService,
    TeamsService,
    JwtHelper
  ]
})
export class UserLoginPageComponent implements OnInit {
  private tokenListener: Function;
  token: string;

  constructor(
      public renderer: Renderer,
      private userService: UserService,
      private teamsService: TeamsService,
      private authService: AuthService,
      private tokenService: TokenService,
      private jwtHelper: JwtHelper,
      private router: Router,
  ) {}

  ngOnInit() {
    // TODO: Improve this nested calls. maybe using flatMap
    this.authService.getTokenListenerRemover(this.renderer, () => {
      this.token = this.tokenService.getToken();
      let userData  = this.jwtHelper.decodeToken(this.token);

      this.userService.getUserTeams(this.token).subscribe (
        (data) => {
          if(data.page.totalElements == 0) {
            this.teamsService.createTeam(this.token).subscribe(
              (data) => {
                let domainReference = data.domainReference;
                this.teamsService.addUserToTeam(this.token, domainReference, userData.sub).subscribe(
                  (data) => {
                  // New team created. Logout.
                  // TODO: Change this bahvour to more appropriate one.
                  this.authService.logOut();
                  alert("New team has beeen created, you have to login again.");
                  },
                  (err) => {

                  }
                )
              },
              (err) => {
                console.log(err);
              }
            );
          }
          // User already has team, redirect him/her to the dashboard.
          this.router.navigate(["/dashboard"]);
        },
        (err) => {
          // TODO: Handle Errors.
          console.log(err);
        }
      );
    });
  }

  isLoggedIn() {
    return this.authService.loggedIn();
  }

}

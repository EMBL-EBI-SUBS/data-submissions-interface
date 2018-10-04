import { Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'angular-aap-auth';
import { TokenService } from 'angular-aap-auth';

// Import Services.
import { UserService } from '../../services/user.service';
import { TeamsService } from '../../services/teams.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './user-login-page.component.html',
  styleUrls: ['./user-login-page.component.scss'],
  providers: [
    AuthService,
    UserService,
    TeamsService,
  ]
})
export class UserLoginPageComponent implements OnInit {
  constructor(
      public renderer: Renderer,
      public authService: AuthService,
      private userService: UserService,
      private teamsService: TeamsService,
      private router: Router,
  ) {}

  ngOnInit() {
    // TODO: Improve this nested calls. maybe using flatMap
    this.authService.addLogInEventListener(() => {

      this.userService.getUserTeams().subscribe (
        (data) => {
            if(data['page']['totalElements'] == 0) {
            this.teamsService.createTeam().subscribe(
              (data) => {
                this.authService.logOut();
                alert("New team has beeen created, you have to login again.");
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
}

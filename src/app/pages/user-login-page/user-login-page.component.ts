import { RequestsService } from 'src/app/services/requests.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'angular-aap-auth';
import { environment } from 'src/environments/environment';

// Import Services.
import { UserService } from '../../services/user.service';
import { TeamsService } from '../../services/teams.service';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { updateToken } from 'src/app/app.module';

@Component({
  selector: 'app-login-page',
  templateUrl: './user-login-page.component.html',
  styleUrls: ['./user-login-page.component.scss'],
})
export class UserLoginPageComponent implements OnInit {
  username: string;
  password: string;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private teamsService: TeamsService,
    private requestsService: RequestsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.username = '';
    this.password = '';
  }

  /**
   * returns sso url
   */
  getSSOURL() {
    return this.authService.getSSOURL();
  }

  getRegisterNewAAPUserURL() {
    return environment.authenticationHost.replace('.api', '') + '/registerUser';
  }

  /**
   * Contacts users api for authentication and api returns the token on success
   */
  authenticateUser() {
    if (this.username != null && this.password != null) {
      this.authenticateWithAAP(this.username, this.password)
        .subscribe(
          token => {
            console.log('[LoginComponent] Obtained token %O', token);
            updateToken(token);

            // TODO karoly remove this hack,
            // after web dev fixed the angular-aap-auth library (version: 1.0.0-alpha.11)
            (this.authService as any)._updateCredentials();

            this.router.navigate(['/dashboard']);
          },
          error => {
            console.log('error: ' + error);
          }
        );
    }
  }

  authenticateWithAAP(userName: string, password: string): Observable<any> {
    console.log('[AuthService] Getting jwt token for user ' + userName);
    const header = this.getHeaders(userName, password);
    return this.requestsService.get(
      environment.authenticationHost + '/auth',
      {
        headers: header,
        responseType: 'text'
      }
    );
  }

  /**
   * create headers
   */
  getHeaders(userName: string, password: string): HttpHeaders {
    const headerJson = {
      'Authorization': 'Basic ' + btoa(userName + ':' + password),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    return new HttpHeaders(headerJson);
  }
}

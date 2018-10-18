import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';


import { TokenService } from 'angular-aap-auth';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!req.url.startsWith(environment.apiHost) && !req.url.startsWith(environment.authenticationHost)) {
      return next.handle(req);
    }

    // Get the auth token from the service.
    // TODO: Replace the implementation of this lib with the new once.
    const authToken = this.tokenService.getToken();

    const authReq = req.clone(
      {
        setHeaders: {
          Authorization: 'Bearer ' + authToken,
          'Content-Type': 'application/json',
          Accept: 'application/hal+json, application/json',
        }
      }
    );

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}

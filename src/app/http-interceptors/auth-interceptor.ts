import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';


import { TokenService } from 'angular-aap-auth';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!req.url.startsWith(environment.apiHost) && !req.url.startsWith(environment.authenticationHost)) {
      return next.handle(req);
    }

    // Get the auth token from the service.
    // TODO: Replace the implementation of this lib with the new once.
    const authToken = this.tokenService.getToken();

    const headers = {
      Authorization:  'Bearer ' + authToken,
      'Content-Type' : 'application/json',
      Accept : 'application/hal+json, application/json',
    };
    // Override header if sent through request.
    if (req.headers.keys().length > 0) {
      for (const headerKey of req.headers.keys()) {
        headers[headerKey] = req.headers.get(headerKey);
      }
    }

    const authReq = req.clone(
      {
        setHeaders: headers
      }
    );

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}

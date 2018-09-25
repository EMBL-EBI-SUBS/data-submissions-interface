import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { TokenService } from 'angular-aap-auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.tokenService.getToken();

    const authReq = req.clone(
      {
        setHeaders: {
          Authorization:  "Bearer " + authToken,
          ContentType : 'application/json',
          Accept : 'application/hal+json, application/json',
        }
      }
    );


    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
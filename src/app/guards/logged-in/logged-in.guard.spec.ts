import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoggedInGuard } from './logged-in.guard';


import {
  AuthModule
} from 'angular-aap-auth';
import {
  JwtModule
} from '@auth0/angular-jwt';

import { MockRouter } from '../../testing/mockrouter.tests';
import { environment } from '../../../environments/environment';

export function getToken(): string {
  return localStorage.getItem('jwt_token') || '';
}
export function updateToken(newToken: string): void {
  return localStorage.setItem('jwt_token', newToken);
}
// Optional
export function removeToken(): void {
  return localStorage.removeItem('jwt_token');
}

describe('LoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useClass: MockRouter},
        LoggedInGuard,
        AuthModule.forRoot({
          aapURL: environment.authenticationHost,
          tokenGetter: getToken,
          tokenUpdater: updateToken,
          tokenRemover: removeToken // Optional
          }),
          JwtModule.forRoot({
              config: {
                  tokenGetter: getToken,
              }
          })
      ]
    });
  });

  it('should ...', inject([LoggedInGuard], (guard: LoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});

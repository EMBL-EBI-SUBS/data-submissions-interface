import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoggedInGuard } from './logged-in.guard';

import { AuthService, TokenService } from 'angular-aap-auth';
import { JwtHelper } from 'angular2-jwt';

import { MockRouter } from '../../testing/mockrouter.tests';
import { environment } from 'environments/environment';

describe('LoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useClass: MockRouter},
        LoggedInGuard,
        AuthService,
        TokenService,
        JwtHelper,
        {
          provide: 'AAP_CONFIG',
          useValue: {
            authURL: environment.authenticationHost
          }
        }
      ]
    });
  });

  it('should ...', inject([LoggedInGuard], (guard: LoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});

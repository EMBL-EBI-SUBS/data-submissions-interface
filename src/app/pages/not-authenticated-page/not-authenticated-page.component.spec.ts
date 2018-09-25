/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, TokenService } from 'angular-aap-auth';
import { JwtHelper } from 'angular2-jwt';

import { MockRouter } from '../../testing/mockrouter.tests';

import { NotAuthenticatedPageComponent } from './not-authenticated-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';
import { UserLoginPageComponent } from '../user-login-page/user-login-page.component';
import { HttpModule } from '@angular/http';
import { environment } from 'environments/environment';

describe('NotAuthenticatedPageComponent', () => {
  let component: NotAuthenticatedPageComponent;
  let fixture: ComponentFixture<NotAuthenticatedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      declarations: [
        NotAuthenticatedPageComponent,
        EbiHeaderComponent,
        UserLoginPageComponent
       ],
      providers: [
        {provide: Router, useClass: MockRouter},
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAuthenticatedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

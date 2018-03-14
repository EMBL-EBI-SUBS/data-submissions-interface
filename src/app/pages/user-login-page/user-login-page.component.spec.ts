/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';

import { AuthService, TokenService } from 'angular-aap-auth';
import { JwtHelper } from 'angular2-jwt';

import { MockRouter } from '../../testing/mockrouter.tests';

import { UserLoginPageComponent } from './user-login-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';

describe('UserLoginPageComponent', () => {
  let component: UserLoginPageComponent;
  let fixture: ComponentFixture<UserLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      declarations: [ UserLoginPageComponent, EbiHeaderComponent ],
      providers: [
        {provide: Router, useClass: MockRouter},
        AuthService,
        TokenService,
        JwtHelper,
        {
          provide: 'AAP_CONFIG',
          useValue: {
            authURL: 'https://explore.api.aai.ebi.ac.uk'
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

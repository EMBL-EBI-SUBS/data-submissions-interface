/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService, TokenService } from 'angular-aap-auth';

import { MockRouter } from '../../testing/mockrouter.tests';

import { UserLoginPageComponent } from './user-login-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';

import { environment } from '../../../environments/environment';

describe('UserLoginPageComponent', () => {
  let component: UserLoginPageComponent;
  let fixture: ComponentFixture<UserLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ UserLoginPageComponent, EbiHeaderComponent ],
      providers: [
        {provide: Router, useClass: MockRouter},
        AuthService,
        TokenService,
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
    fixture = TestBed.createComponent(UserLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

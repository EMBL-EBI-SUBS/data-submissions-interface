/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, TokenService } from 'angular-aap-auth';
import { JwtHelper } from 'angular2-jwt';

import { MockRouter } from '../../../testing/mockrouter.tests';
import { RouterLinkStubDirective } from '../../../testing/router.stubs';

import { SubmitPageComponent } from './submit-page.component';
import { EbiHeaderComponent } from '../../../components/ebi-header/ebi-header.component';

describe('SubmitPageComponent', () => {
  let component: SubmitPageComponent;
  let fixture: ComponentFixture<SubmitPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPageComponent, EbiHeaderComponent, RouterLinkStubDirective ],
      providers: [
        {provide: Router, useClass: MockRouter},
        AuthService,
        TokenService,
        JwtHelper,
        {
          provide: 'AAP_CONFIG',
          useValue: {
            authURL: 'https://api.aap.tsi.ebi.ac.uk'
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

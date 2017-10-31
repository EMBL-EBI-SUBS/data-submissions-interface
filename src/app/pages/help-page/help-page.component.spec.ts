/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, TokenService } from 'angular-aap-auth';
import { JwtHelper } from 'angular2-jwt';

import { MockRouter } from '../../testing/mockrouter.tests';

// Import Components.
import { HelpPageComponent } from './help-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';

describe('HelpPageComponent', () => {
  let component: HelpPageComponent;
  let fixture: ComponentFixture<HelpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelpPageComponent,
        EbiHeaderComponent
     ],
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
    fixture = TestBed.createComponent(HelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

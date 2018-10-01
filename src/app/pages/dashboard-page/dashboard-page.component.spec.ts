/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService, TokenService } from 'angular-aap-auth';

import { MockRouter } from '../../testing/mockrouter.tests';

//  Import Components.
import { DashboardPageComponent } from './dashboard-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';
import { environment } from 'environments/environment';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [
        DashboardPageComponent,
        EbiHeaderComponent
      ],
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
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

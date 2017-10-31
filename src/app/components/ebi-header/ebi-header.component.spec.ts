import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService, TokenService } from 'angular-aap-auth';
import { JwtHelper } from 'angular2-jwt';

import { MockRouter } from '../../testing/mockrouter.tests';

//  Import Components.
import { EbiHeaderComponent } from './ebi-header.component';



describe('EbiHeaderComponent', () => {
  let component: EbiHeaderComponent;
  let fixture: ComponentFixture<EbiHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbiHeaderComponent ],
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
    fixture = TestBed.createComponent(EbiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

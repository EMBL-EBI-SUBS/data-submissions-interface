import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService, TokenService } from 'angular-aap-auth';
import { MockRouter } from '../../testing/mockrouter.tests';

//  Import Components.
import { EbiHeaderComponent } from './ebi-header.component';
import { environment } from 'environments/environment';



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
    fixture = TestBed.createComponent(EbiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

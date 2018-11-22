import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { MockRouter } from 'testing/mockrouter.tests';
import { CommonTestModule } from 'testing/common.module';

import { NotAuthenticatedPageComponent } from './not-authenticated-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';
import { UserLoginPageComponent } from '../user-login-page/user-login-page.component';

describe('NotAuthenticatedPageComponent', () => {
  let component: NotAuthenticatedPageComponent;
  let fixture: ComponentFixture<NotAuthenticatedPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonTestModule,
        FormsModule
      ],
      declarations: [
        NotAuthenticatedPageComponent,
        EbiHeaderComponent,
        UserLoginPageComponent
      ],
      providers: [
        { provide: Router, useClass: MockRouter }
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

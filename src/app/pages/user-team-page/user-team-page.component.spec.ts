import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { MockRouter } from 'testing/mockrouter.tests';
import { CommonTestModule } from 'testing/common.module';

import { UserLoginPageComponent } from '../user-login-page/user-login-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';

describe('UserTeamPageComponent', () => {
  let component: UserLoginPageComponent;
  let fixture: ComponentFixture<UserLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonTestModule
      ],
      declarations: [ UserLoginPageComponent, EbiHeaderComponent ],
      providers: []
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

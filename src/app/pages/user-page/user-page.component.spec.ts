import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { MockRouter } from 'testing/mockrouter.tests';
import { CommonTestModule } from  'testing/common.module';

import { UserPageComponent } from './user-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';

import { environment } from 'src/environments/environment';

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonTestModule
      ],
      declarations: [ UserPageComponent, EbiHeaderComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

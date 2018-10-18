import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { CommonTestModule } from 'testing/common.module';
import { MockRouter } from 'testing/mockrouter.tests';

//  Import Components.
import { DashboardPageComponent } from './dashboard-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';
import { environment } from 'src/environments/environment';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonTestModule],
      declarations: [
        DashboardPageComponent,
        EbiHeaderComponent
      ],
      providers: [
        {provide: Router, useClass: MockRouter},
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

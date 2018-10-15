import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { MockRouter } from 'testing/mockrouter.tests';
import { CommonTestModule } from  'testing/common.module';

import { NotFoundPageComponent } from './not-found-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';
import { environment } from 'src/environments/environment';

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFoundPageComponent, EbiHeaderComponent ],
      imports: [
        RouterTestingModule,
        CommonTestModule
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

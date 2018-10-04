/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';


import { MockRouter } from '../../testing/mockrouter.tests';

// Import Components.
import { HelpPageComponent } from './help-page.component';
import { EbiHeaderComponent } from '../../components/ebi-header/ebi-header.component';
import { environment } from 'src/environments/environment';

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

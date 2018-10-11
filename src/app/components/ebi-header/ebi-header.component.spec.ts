import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockRouter } from 'testing/mockrouter.tests';
import { CommonTestModule } from  'testing/common.module';

//  Import Components.
import { EbiHeaderComponent } from './ebi-header.component';
import { environment } from 'src/environments/environment';

describe('EbiHeaderComponent', () => {
  let component: EbiHeaderComponent;
  let fixture: ComponentFixture<EbiHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonTestModule
      ],
      declarations: [ EbiHeaderComponent ],
      providers: []
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

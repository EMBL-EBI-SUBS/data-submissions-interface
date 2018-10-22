import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EbiNavbarComponent } from './ebi-navbar.component';

describe('EbiNavbarComponent', () => {
  let component: EbiNavbarComponent;
  let fixture: ComponentFixture<EbiNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EbiNavbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbiNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

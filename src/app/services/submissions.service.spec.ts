import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { SubmissionsService } from './submissions.service';

describe('SubmissionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [SubmissionsService]
    });
  });

  it('should be created', inject([SubmissionsService], (service: SubmissionsService) => {
    expect(service).toBeTruthy();
  }));
});

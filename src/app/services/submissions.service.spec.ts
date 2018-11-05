import { TestBed, inject } from '@angular/core/testing';
import { SubmissionsService } from './submissions.service';
import { HttpClientModule } from '@angular/common/http';

describe('SubmissionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SubmissionsService]
    });
  });

  it('should be created', inject([SubmissionsService], (service: SubmissionsService) => {
    expect(service).toBeTruthy();
  }));
});

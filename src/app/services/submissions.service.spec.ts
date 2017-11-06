import { TestBed, inject } from '@angular/core/testing';

import { SubmissionsService } from './submissions.service';

describe('SubmissionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubmissionsService]
    });
  });

  it('should be created', inject([SubmissionsService], (service: SubmissionsService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { RequestsService } from './requests.service';

describe('RequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [RequestsService]
    });
  });

  it('should be created', inject([RequestsService], (service: RequestsService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';
import { TeamsService } from './teams.service';
import { HttpClientModule } from '@angular/common/http';

describe('TeamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TeamsService]
    });
  });

  it('should be created', inject([TeamsService], (service: TeamsService) => {
    expect(service).toBeTruthy();
  }));
});

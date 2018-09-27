import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { EndpointService } from './endpoint.service';

describe('EndpointService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [EndpointService]
    });
  });

  it('should be created', inject([EndpointService], (service: EndpointService) => {
    service.cache ={
    }
    expect(service).toBeTruthy();
  }));

  it('should find', inject([EndpointService], (service: EndpointService) => {
    service.cache ={ userTeams: {href: 'dummy'}};
    expect(service.find('userTeams')).toEqual('dummy');
  }));

  it('should not find', inject([EndpointService], (service: EndpointService) => {
    service.cache ={ userTeams: {href: 'dummy'}};
    expect(service.find('none')).toBeNull();
  }));
});

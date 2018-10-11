import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';

import { EndpointService } from './endpoint.service';

describe('EndpointService', () => {
  const mockedResponse = {_links: {userTeams: {href: 'https://dummy' }}};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EndpointService]
    });
  });

  beforeEach(inject([EndpointService], (serv: EndpointService) => {
  }));

  it('should be created', inject([EndpointService], (service: EndpointService) => {
    const http = TestBed.get(HttpTestingController);
    http.expectOne(environment.apiHost);
    expect(service).toBeTruthy();
  }));

  it('should find endpoint', inject([EndpointService], (service: EndpointService) => {
    const http = TestBed.get(HttpTestingController);
    http.expectOne(environment.apiHost).flush(mockedResponse);
    let url: string | undefined;
    service.find('userTeams').subscribe(result => url = result)
    expect(url).toEqual('https://dummy');
  }));

  it('should not find endpoint', inject([EndpointService], (service: EndpointService) => {
    const http = TestBed.get(HttpTestingController);
    http.expectOne(environment.apiHost).flush(mockedResponse);
    let url: string | undefined;
    service.find('dummy').subscribe(result => url = result)
    expect(url).toBeUndefined();
  }));
});

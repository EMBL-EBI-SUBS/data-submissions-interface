import { Headers } from '@angular/http';
import { environment } from '../../environments/environment';

export class VariablesService {
  host: string = environment.apiHost;
  authenticationHost: string = environment.authenticationHost;

  constructor() { }

  buildHeader(token: String) {
    // Build initial header.
    let header = new Headers({
      'Content-Type' : 'application/json',
      'Accept' : 'application/hal+json, application/json'
    });

    // Add authentication to header.
    if(token) {
      header.append("Authorization", "Bearer " + token);
    }

    return header;
  }
}

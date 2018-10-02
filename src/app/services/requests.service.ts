
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class RequestsService {
  variables = new VariablesService;


  constructor(private http: HttpClient) { }

  /**
   * Get record.
   */
  get(token, url) {
    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  url;
    var response = this.http.get(requestUrl);
    return response;
  }

  /**
   * Create new record.
   */
  create(token, url, data) {
    // Post an Empty object to create submission.
    let body = JSON.stringify(data);

    let requestUrl =  url;
    var response = this.http.post(requestUrl, body);
    return response;
  }

   /**
   * Create new record.
   */
  createNoAuth(url, data) {
    // Post an Empty object to create submission.
    let body = JSON.stringify(data);

    let requestUrl =  url;
    var response = this.http.post(requestUrl, body);
    return response;
  }

  /**
   * Update an existing record.
   */
  update(token, url, data) {
    // Post an Empty object to create submission.
    let body = JSON.stringify(data);

    let requestUrl =  url;
    var response = this.http.put(requestUrl, body);
    return response;
  }

  /**
   * Partially update an existing record.
   */
  partialUpdate(token, url, data) {
      // Post an Empty object to create submission.
      let body = JSON.stringify(data);

      let requestUrl =  url;
      var response = this.http.patch(requestUrl, body);
      return response;
  }

  /**
   * Delete an existing record.
   */
  delete(token, url) {
    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  url;
    var response = this.http.delete(requestUrl);
    return response;
  }
}

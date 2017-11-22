import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class RequestsService {
  variables = new VariablesService;


  constructor(private http: Http) { }

  static get parameters() {
   return [[Http]];
  }

  /**
   * Get record.
   */
  get(token, url) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  url;
    var response = this.http.get(requestUrl, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * Create new record.
   */
  create(token, url, data) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify(data);

    let requestUrl =  url;
    var response = this.http.post(requestUrl, body, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * Update an existing record.
   */
  update(token, url, data) {
      let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify(data);

    let requestUrl =  url;
    var response = this.http.put(requestUrl, body, requestOptions).map(res => res.json());
    return response;
  }

  /**
   * Partially update an existing record.
   */
  partialUpdate(token, url, data) {
      let headers = this.variables.buildHeader(token);

      let requestOptions = new RequestOptions({
          headers: headers
      });

      // Post an Empty object to create submission.
      let body = JSON.stringify(data);

      let requestUrl =  url;
      var response = this.http.patch(requestUrl, body, requestOptions).map(res => res.json());
      return response;
  }

  /**
   * Delete an existing record.
   */
  delete(token, url) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
        headers: headers
    });

    // Post an Empty object to create submission.
    let body = JSON.stringify({});

    let requestUrl =  url;
    var response = this.http.delete(requestUrl, requestOptions).map(res => res.json());
    return response;
  }
}

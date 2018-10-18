import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class RequestsService {
  variables = new VariablesService;

  constructor(private http: HttpClient) { }

  /**
   * Get record.
   */
  get(url, options = {}) {
    const requestUrl = url;
    const response = this.http.get(requestUrl, options);
    return response;
  }

  /**
   * Create new record.
   */
  create(url, data) {
    // Post an Empty object to create submission.
    const body = JSON.stringify(data);

    const requestUrl = url;
    const response = this.http.post(requestUrl, body);
    return response;
  }

  /**
  * Create new record.
  */
  createNoAuth(url, data) {
    // Post an Empty object to create submission.
    const body = JSON.stringify(data);

    const requestUrl = url;
    const response = this.http.post(requestUrl, body);
    return response;
  }

  /**
   * Update an existing record.
   */
  update(url, data) {
    // Post an Empty object to create submission.
    const body = JSON.stringify(data);

    const requestUrl = url;
    const response = this.http.put(requestUrl, body);
    return response;
  }

  /**
   * Partially update an existing record.
   */
  partialUpdate(url, data, requestParam = {}) {
    let httpParams = new HttpParams();
    for (const key in requestParam) {
      if (requestParam.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, requestParam[key]);
      }
    }

    // Post an Empty object to create submission.
    const body = JSON.stringify(data);
    const requestUrl = url;

    return this.http.patch(
      requestUrl,
      body,
      { params: httpParams }
    );
  }

  /**
   * Delete an existing record.
   */
  delete(requestUrl) {
    const response = this.http.delete(
      requestUrl,
      {
        observe: 'response',
        responseType: 'json'
      }
    );
    return response;
  }
}

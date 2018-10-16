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
  get(requestUrl, options = {}) {
    return this.http.get(requestUrl, options);
  }

  /**
   * Create new record.
   */
  create(requestUrl, data) {
    // Post an Empty object to create submission.
    const body = JSON.stringify(data);

    return this.http.post(requestUrl, body);
  }

   /**
   * Create new record.
   */
  createNoAuth(requestUrl, data) {
    // Post an Empty object to create submission.
    const body = JSON.stringify(data);

    return this.http.post(requestUrl, body);
  }

  /**
   * Update an existing record.
   */
  update(requestUrl, data) {
    // Post an Empty object to create submission.
    const body = JSON.stringify(data);

    return this.http.put(requestUrl, body);
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
    const requestUrl =  url;

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

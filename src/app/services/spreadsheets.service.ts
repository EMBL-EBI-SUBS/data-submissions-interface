import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class SpreadsheetsService {
  variables = new VariablesService;
  templatesListEndpoint = this.variables.host + "templates";

  constructor(private http: Http) { }

  static get parameters() {
   return [[Http]];
  }

  /**
   * List of templates that user can use.
   */
  getTemplatesList(token: String, options: any = { size: 12, page: 0}) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
      headers: headers
    });

    let requestUrl =  this.templatesListEndpoint + "?size=" + options.size + "&page=" + options.page;
    var response = this.http.get(requestUrl, requestOptions).map(res => res.json());
    return response;
  }

   /**
   * Create new record.
   */
  create(token, url, data) {
    let headers = this.variables.buildHeader(token);

    headers.set("Content-Type", "text/csv");

    let requestOptions = new RequestOptions({
        headers: headers
    });


    let requestUrl =  url;
    var response = this.http.post(requestUrl, data, requestOptions).map(res => res.json());
    return response;
  }
}


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class SpreadsheetsService {
  variables = new VariablesService;
  templatesListEndpoint = this.variables.host + "templates";

  constructor(private http: HttpClient) { }

  /**
   * List of templates that user can use.
   */
  getTemplatesList(options: any = { size: 12, page: 0}) {
    let requestUrl =  this.templatesListEndpoint + "?size=" + options.size + "&page=" + options.page;
    var response = this.http.get(requestUrl);
    return response;
  }

   /**
   * Create new record.
   */
  create(url, data) {
    let header = new HttpHeaders({
      'Content-Type' : 'text/csv',
    });

    let requestUrl =  url;
    var response = this.http.post(requestUrl, data, { headers: header });
    return response;
  }

  /**
   * Update active spreadsheet.
   */
  setActiveSpreadsheet(spreadsheet: any) {
    localStorage.setItem("active_spreadsheet", JSON.stringify(spreadsheet));
  }

  /**
   * Retrieve active spreadsheet.
   */
  getActiveSpreadsheet() {
    return JSON.parse(localStorage.getItem("active_spreadsheet"));
  }

  /**
   * Delete active spreadsheet.
   */
  deleteActiveSpreadsheet() {
    localStorage.removeItem("active_spreadsheet");
  }
}

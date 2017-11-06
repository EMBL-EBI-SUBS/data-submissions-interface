import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
// Import Service Variables.
import { VariablesService } from './variables.service';

@Injectable()
export class TeamsService {
  variables = new VariablesService;
  listApiEndpoint = this.variables.host + "teams";

  constructor(private http: Http) { }

  static get parameters() {
   return [[Http]];
  }

  /**
   * List Team Members for Current Logged in user.
   */
  list(token: String, options: any = { size: 12, page: 0}) {
    let headers = this.variables.buildHeader(token);

    let requestOptions = new RequestOptions({
      headers: headers
    });

    let requestUrl =  this.listApiEndpoint + "?size=" + options.size + "&page=" + options.page;
    var response = this.http.get(requestUrl, requestOptions).map(res => res.json());
    return response;
  }
}

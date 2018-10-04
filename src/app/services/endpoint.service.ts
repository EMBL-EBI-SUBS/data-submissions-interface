import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable()
export class EndpointService {
  public cache = {};

  constructor(private _http: HttpClient) {
    // When we use the version 6 of RxJS, include a retry operator
    this._http.get(environment.apiHost).subscribe(response => this.cache = response);
  }

  async find(name: string) {
    if (this.cache['_links'] && this.cache['_links'][name]) {
      return this.cache['_links'][name]['href'];
    }

    this.cache = await this._http.get(environment.apiHost).toPromise();
    return this.cache['_links'][name]['href'];
  }

}

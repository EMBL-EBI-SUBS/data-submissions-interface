import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
// import { retry } from 'rxjs/operators';

@Injectable()
export class EndpointService {
  public cache = {};

  constructor(private _http: HttpClient) {
    // When we use the version 6 of RxJS, include a retry operator
    this._http.get(environment.apiHost).subscribe(response => this.cache = response);
  }

  public find(name: string): string | null{
    if(this.cache[name]){
      return this.cache[name]['href'];
    }
    return null;
  }

}

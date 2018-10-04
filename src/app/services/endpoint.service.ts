import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable, AsyncSubject, throwError } from 'rxjs';
import { retry, pluck, tap, catchError } from 'rxjs/operators';

interface ApiResponse {
  _links: {
    [key: string]: {
      href: string
    }
  }
}

@Injectable()
export class EndpointService {
  private _cache = new AsyncSubject<ApiResponse>();

  constructor(private _http: HttpClient) {
    this._cache.pipe(
      tap(data => this._cache.next(data)),
      tap(_ => this._cache.complete()),
      // TODO: anything else before we re-throw the error?
      catchError(error => throwError(error)),
    ).subscribe();

    this._http.get<ApiResponse>(environment.apiHost).pipe(
      retry(3),
    ).subscribe(this._cache);
  }

  public find(name: string): Observable<string | undefined> {
    return this._cache.asObservable().pipe(
        pluck('_links', name, 'href')
    );
  }
}

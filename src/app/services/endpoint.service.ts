import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
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
    this._http.get<ApiResponse>(environment.apiHost).pipe(
      tap(data => {
        this._cache.next(data);
        this._cache.complete();
      }),
      retry(3),
      catchError(error => throwError(error)),
    ).subscribe();
  }

  public find(name: string): Observable<string | undefined> {
    return this._cache.asObservable().pipe(
        pluck('_links', name, 'href')
    );
  }
}

import {
  Injectable
} from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
  constructor(private _notify: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              this._notify.error('Please login to continue.');
              break;
            case 404:
              this._notify.error('Requested resource is not available.');
              break;
            case 500:
              this._notify.error('Sorry, there was a backend problem.');
              break;
            default:
              this._notify.error('Sorry, there was and unknown error.');
          }
        } else {
          this._notify.error('Unknown network error. Please, try again.');
        }
        return throwError(error);
      })
    );
  }
}

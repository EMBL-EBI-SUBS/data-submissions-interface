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
              this._notify.error(
                'The username or password that you entered did not match our records. Please double-check and try again.');
              break;
            case 404:
              this._notify.error('Requested resource is not available. Please double-check and try again.');
              break;
            case 500:
              let errorMessage = 'You have experienced a technical error. We apologize. We are working to correct this issue.';
              errorMessage += ' Please, wait a few moments and try it again.';
              this._notify.error(errorMessage);
              break;
            default:
              this._notify.error('Sorry, there was an unknown error. We apologize. Please, report this through our help desk. Thank you.');
          }
        } else {
          this._notify.error('Unknown network error happened. Please, try again.');
        }
        return throwError(error);
      })
    );
  }
}

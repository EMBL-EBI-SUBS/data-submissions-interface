import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'angular-aap-auth';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class LoggedInGuard implements CanActivate {
isAuthenticated: Observable < boolean > ;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.isAuthenticated = authService.isAuthenticated().pipe(
      map(value => value && true || false)
    );
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.isAuthenticated().pipe(
        map(e => {
          if (e) {
            return true;
          } else {
            this.router.navigate(['/403']);
            return false;
          }
        }),
        catchError((err) => {
          console.log(err);
          this.router.navigate(['/403']);
          return of(false);
        })
      );
  }
}

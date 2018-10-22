import { NgModule } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthModule } from 'angular-aap-auth';
import { ToastrModule } from 'ngx-toastr';
import { ServiceModule } from 'src/app/services/service.module';
import { environment } from 'src/environments/environment';

import { YesNoPipe } from 'src/app/pipes/yes-no.pipe';

export const jwtName = 'test_usi';
export function getToken(): string {
  return localStorage.getItem(jwtName) || '';
}
export function updateToken(newToken: string): void {
  return localStorage.setItem(jwtName, newToken);
}
export function removeToken(): void {
  return localStorage.removeItem(jwtName);
}

@NgModule({
  imports: [
    HttpClientTestingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        whitelistedDomains: [],
      }
    }),
    AuthModule.forRoot({
      aapURL: '',
      tokenGetter: getToken,
      tokenUpdater: updateToken,
      tokenRemover: removeToken
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      closeButton: true,
      maxOpened: 5,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    ServiceModule
  ],
  exports: [],
  providers: [],
  declarations: [
    YesNoPipe
  ],
})
export class CommonTestModule { }

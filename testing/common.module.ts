import { NgModule } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthModule } from 'angular-aap-auth';
import { ToastrModule } from 'ngx-toastr';

import { environment } from 'src/environments/environment';

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
          positionClass: 'toast-bottom-center',
          closeButton: true,
          maxOpened: 5,
          preventDuplicates: true,
          resetTimeoutOnDuplicate: true
        })
    ],
    exports: [],
    providers: [],
    declarations: [],
})
export class CommonTestModule {}

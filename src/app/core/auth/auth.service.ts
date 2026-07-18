import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly oidc =
        inject(OidcSecurityService);


    login(): void {
        console.log('Redirigiendo a Cognito');
        this.oidc.authorize();

    }


    logout(): void {

        this.oidc.logoff()
            .subscribe();

    }


    getAccessToken() {

        return this.oidc.getAccessToken();

    }


    getUserData() {

        return this.oidc.userData$;

    }


    isAuthenticated() {

        return this.oidc.isAuthenticated$;

    }

}
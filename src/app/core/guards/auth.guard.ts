import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs';


export const authGuard: CanActivateFn = () => {


 const oidc = inject(OidcSecurityService);

 const router = inject(Router);


 return oidc.isAuthenticated$
 .pipe(

   map(auth=>{

      if(auth.isAuthenticated){

        return true;

      }


      router.navigate(['/login']);

      return false;

   })

 );


};
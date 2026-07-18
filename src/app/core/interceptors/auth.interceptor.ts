import {
  HttpHandlerFn,
  HttpInterceptorFn, HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap } from 'rxjs';

export const authInterceptor = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
 )=>{
 
 
  const oidc =
  inject(OidcSecurityService);
 
 
  return oidc.getAccessToken()
  .pipe(
 
   switchMap(token=>{
 
 
     if(token){
 
       req =
       req.clone({
 
         setHeaders:{
           Authorization:
           `Bearer ${token}`
         }
 
       });
 
     }
 
 
     return next(req);
 
   })
 
  );
 
 
 };
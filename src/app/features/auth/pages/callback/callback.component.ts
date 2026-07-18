import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
 selector: 'app-callback',
 standalone: true,
 template: 'Cargando sesión...'
})
export class CallbackComponent implements OnInit {

  private oidc = inject(OidcSecurityService);
  private router = inject(Router);

  ngOnInit() {
    this.oidc.checkAuth().subscribe(result => {
       console.log("AUTH RESULT", result);
       console.log("Authenticated:", result.isAuthenticated);
       console.log("Access Token:", result.accessToken);
       console.log("User Data:", result.userData);
   
       if (result.isAuthenticated) {
          this.router.navigate(['/dashboard']);
       } else {
          // ⚡ Si la comprobación falla o no viene código de Cognito, al login directo.
          console.warn("No autenticado en callback, redirigiendo a login.");
          this.router.navigate(['/login']);
       }
    });
   }
}
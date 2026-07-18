import { Component, inject, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';


@Component({
 selector:'app-callback',
 standalone:true,
 template:'Cargando sesión...'
})
export class CallbackComponent implements OnInit {


private oidc = inject(OidcSecurityService);

private router = inject(Router);



ngOnInit() {
  this.oidc.checkAuth().subscribe({
    next: (result) => {
      console.log("RESULTADO COGNITO", result);

      if (result.isAuthenticated) {
        console.log("TOKEN", result.accessToken);
        this.router.navigate(['/dashboard']);
      } else {
        // 👈 Si no está autenticado o da el error 'no code', regrésalo al login
        console.warn("Autenticación inválida o código ausente. Redirigiendo a Login.");
        this.router.navigate(['/login']);
      }
    },
    error: (err) => {
      console.error("ERROR AUTH", err);
      this.router.navigate(['/login']);
    }
  });
}

}
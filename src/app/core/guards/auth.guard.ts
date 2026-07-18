import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs/operators'; // 👈 Asegúrate de importar 'take'

export const authGuard: CanActivateFn = () => {
  const oidc = inject(OidcSecurityService);
  const router = inject(Router);

  return oidc.isAuthenticated$.pipe(
    take(1), // ⚡ Toma solo el primer valor emitido para evitar escuchar cambios infinitos durante la navegación
    map(auth => {
      if (auth.isAuthenticated) {
        return true;
      }

      // ⚡ En lugar de navegar manualmente, devolvemos el UrlTree al login
      return router.createUrlTree(['/login']);
    })
  );
};
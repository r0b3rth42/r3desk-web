import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAuth } from 'angular-auth-oidc-client'; // 👈 Removimos el initializer problemático
import { authConfig } from './core/auth/auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAuth({
      config: authConfig
    }) // 👈 Simplificado sin 'withAppInitializerAuthCheck()' para evitar bloqueos en el arranque
  ]
};
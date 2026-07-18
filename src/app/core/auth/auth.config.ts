import { OpenIdConfiguration } from 'angular-auth-oidc-client';

// 1. Reemplaza esto con el dominio de tu interfaz de usuario de Cognito (Cognito Domain)
// Lo encuentras en AWS Console -> User Pools -> App Integration -> Domain
const COGNITO_DOMAIN = 'https://tu-dominio-cognito.auth.us-east-1.amazoncognito.com'; 

export const authConfig: OpenIdConfiguration = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_eMp25vSU1',
  redirectUrl: 'http://localhost:4200/callback',
  postLogoutRedirectUri: 'http://localhost:4200/login',
  clientId: 'voudcrf2um7mq07afqm6hvto0',
  responseType: 'code',
  scope: 'openid email phone profile',
  useRefreshToken: true,
  silentRenew: true,

  // ⚡ CONFIGURACIÓN EXPLÍCITA DE ENDPOINTS PARA COGNITO ⚡
  authWellknownEndpointUrl: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_eMp25vSU1/.well-known/openid-configuration',
  
  customParamsAuthRequest: {
    // Fuerza a la librería a utilizar tu dominio personalizado de login de AWS
    authorization_endpoint: `${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `${COGNITO_DOMAIN}/logout`
  },
  
  autoUserInfo: false // Evita llamadas automáticas fallidas al endpoint userInfo estándar de OIDC
};
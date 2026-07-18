import { OpenIdConfiguration } from 'angular-auth-oidc-client';

const COGNITO_DOMAIN = 'https://us-east-1emp25vsu1.auth.us-east-1.amazoncognito.com'; 
const currentOrigin = window.location.origin;

// ⚡ Identifica si estás ejecutando el proyecto localmente
const isLocalhost = currentOrigin.includes('localhost');

export const authConfig: OpenIdConfiguration = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_eMp25vSU1',
  redirectUrl: `${currentOrigin}/callback`,
  postLogoutRedirectUri: `${currentOrigin}/login`,
  clientId: 'voudcrf2um7mq07afqm6hvto0',
  responseType: 'code',
  scope: 'openid email phone profile',
  
  // ⚡ Desactivamos silentRenew en Localhost para romper el bucle infinito
  useRefreshToken: true,
  silentRenew: !isLocalhost, 

  authWellknownEndpointUrl: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_eMp25vSU1/.well-known/openid-configuration',
  
  customParamsAuthRequest: {
    authorization_endpoint: `${COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `${COGNITO_DOMAIN}/logout`
  },
  
  autoUserInfo: true
};
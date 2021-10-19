export const gtmConfig = {
  containerId: process.env.REACT_APP_GTM_CONTAINER_ID,
};

export const IDENTITY_CONFIG = {
  authority: process.env.REACT_APP_AUTH_URL,
  client_id: process.env.REACT_APP_IDENTITY_CLIENT_ID,
  login: `${process.env.REACT_APP_AUTH_URL}/-/interlink/login`,
  redirect_uri: `${process.env.BASE_URI}/callback`,
  silent_redirect_uri: `${process.env.BASE_URI}/silentRenew`,
  post_logout_redirect_uri: `${process.env.BASE_URI}/logoutCallback`,
  loadUserInfo: false,
  automaticSilentRenew: false,
  revokeAccessTokenOnSignout: false,
  scope:
    'openid profile email offline_access',
  response_type: 'code',
  webAuthResponseType: 'code',
};

export const METADATA_OIDC = {
  issuer: process.env.REACT_APP_AUTH_URL,

  jwks_uri: `${process.env.REACT_APP_AUTH_URL}/jwk`,
  // end_session_endpoint: `${process.env.REACT_APP_AUTH_URL}/endsession`,
  userinfo_endpoint: `${process.env.REACT_APP_AUTH_URL}/userinfo`,

  login: `${process.env.REACT_APP_AUTH_URL}/-/interlink/login`,
  authorization_endpoint: `${process.env.REACT_APP_AUTH_URL}/oauth/authorize`,
  token_endpoint: `${process.env.REACT_APP_AUTH_URL}/oauth/token`,
  revocation_endpoint: `${process.env.REACT_APP_AUTH_URL}/oauth/revoke`,
  introspection_endpoint: `${process.env.REACT_APP_AUTH_URL}/oauth/introspect`,
};

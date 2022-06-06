const env = window._jsenv || process.env;

export const PRODUCTION_MODE = env.NODE_ENV === "production"
export const REACT_APP_ENABLE_REDUX_DEV_TOOLS = env.REACT_APP_ENABLE_REDUX_DEV_TOOLS

export const REACT_APP_DOMAIN = env.REACT_APP_DOMAIN;
export const REACT_APP_COMPLETE_DOMAIN = `${env.REACT_APP_PROTOCOL}${env.REACT_APP_DOMAIN}`;

export const DEFAULT_LANGUAGE = env.REACT_APP_DEFAULT_LANGUAGE || 'en';
export const ALLOWED_LANGUAGES = env.REACT_APP_ALLOWED_LANGUAGES ? env.REACT_APP_ALLOWED_LANGUAGES.split(',') : ['en', 'es', 'lv', 'it'];

export const REACT_APP_MATOMO_ID = env.REACT_APP_MATOMO_ID;

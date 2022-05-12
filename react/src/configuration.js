export const env = window._jsenv || process.env;

export const DEFAULT_LANGUAGE = env.REACT_APP_DEFAULT_LANGUAGE || 'en';
export const ALLOWED_LANGUAGES = env.REACT_APP_ALLOWED_LANGUAGES ? env.REACT_APP_ALLOWED_LANGUAGES.split(',') : ['en', 'es', 'lv', 'it'];

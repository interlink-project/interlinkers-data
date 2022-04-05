import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import store from 'store';
import TRANSLATIONS_EN from './en';
import TRANSLATIONS_ES from './es';
import TRANSLATIONS_LV from './lv';
import TRANSLATIONS_IT from './it';
import axiosInstance from 'axiosInstance';

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGES = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Español',
    value: 'es',
  },
  {
    label: 'Latviešu',
    value: 'lv',
  },
  {
    label: 'Italiano',
    value: 'it',
  },
];

export const setLanguage = (language) => {
  if (!LANGUAGES.every((el) => language !== el.value)) {
    console.log(`Setting ${language} language`);
    store.set('language', language);
    i18n.changeLanguage(language);
    window.location.reload();
    // axiosInstance.defaults.headers['Accept-Language'] = language;
  } else {
    console.error('Language', language, 'not supported. Only:', LANGUAGES);
  }
};

export const getInitialLanguage = () => {
  console.log("Returning", store.get('language', DEFAULT_LANGUAGE))
  return store.get('language', DEFAULT_LANGUAGE)
};


i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "es": {
        translation: TRANSLATIONS_ES,
      },
      "en": {
        translation: TRANSLATIONS_EN,
      },
      "it": {
        translation: TRANSLATIONS_IT,
      },
      "lv": {
        translation: TRANSLATIONS_LV,
      },
    },
    fallbackLng: getInitialLanguage(),
    debug: true,
  });

export default i18n;

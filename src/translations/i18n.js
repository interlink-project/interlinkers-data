import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import store from 'store';
import TRANSLATIONS_EN from './en';
import TRANSLATIONS_ES from './es';
import TRANSLATIONS_EU from './eu';
import axios from 'axios';

export const DEFAULT_LANGUAGE = 'en';
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: TRANSLATIONS_ES,
      },
      eu: {
        translation: TRANSLATIONS_EU,
      },
      en: {
        translation: TRANSLATIONS_EN,
      },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    debug: true,
  });

export const LANGUAGES = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Euskera',
    value: 'eu',
  },
  {
    label: 'Castellano',
    value: 'es',
  },
];

export const setLanguage = (language) => {
  if (!LANGUAGES.every((el) => language !== el.value)) {
    console.log(`Setting ${language} language`);
    store.set('language', language);
    i18n.changeLanguage(language);
    axios.defaults.headers['Accept-Language'] = language;
  } else {
    console.error('Language', language, 'not supported. Only:', LANGUAGES);
  }
};

export default i18n;

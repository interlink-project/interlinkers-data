import i18n from './translations/i18n';

export const THEMES = {
  LIGHT: {
    label:  () => i18n.t('LIGHT'),
    key: "LIGHT"
  },
  DARK: {
    label:  () => i18n.t('DARK'),
    key: "DARK"
  },
  NATURE: {
    label:  () => i18n.t('NATURE'),
    key: "NATURE"
  },
};

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

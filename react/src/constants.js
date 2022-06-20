import i18n from './translations/i18n';

export const THEMES = {
  LIGHT: {
    label: () => i18n.t('LIGHT'),
    key: 'LIGHT'
  },
  DARK: {
    label: () => i18n.t('DARK'),
    key: 'DARK'
  },
};


export const ORG_TYPES = (t) => [{
  value: "citizen",
  label: t("Citizens")
},
{
  value: "public_administration",
  label: t("Public administration")
},
{
  value: "nonprofit_organization",
  label: t("Non profit organization")
},
{
  value: "forprofit_organization",
  label: t("For profit organization")
}]
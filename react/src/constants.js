import { defaultTeamTypesTranslations, teamCreationPermissionTranslations } from 'utils/someCommonTranslations';
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


export const TEAM_TYPES = (t) => {
  const translations = defaultTeamTypesTranslations(t)

  return [{

    value: "citizen",
    label: translations["citizens"]
  },
  {
    value: "public_administration",
    label: translations["public_administration"]
  },
  {
    value: "nonprofit_organization",
    label: translations["nonprofit_organization"]
  },
  {
    value: "forprofit_organization",
    label: translations["forprofit_organization"]
  }]
}


export const WHO_CAN_CREATE_OPTIONS = (t, isPublic) => {
  const translations = teamCreationPermissionTranslations(t)

  return [{
    value: "administrators",
    label: translations["administrators"]
  },
  {
    value: "members",
    label: translations["members"]
  },
  {
    value: "anyone",
    label: translations["anyone"],
    disabled: !isPublic
  },
  ]
}

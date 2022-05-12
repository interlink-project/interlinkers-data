import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getLanguage } from 'translations/i18n';

const useDependantTranslation = () => {
  const { process } = useSelector((state) => state.process);
  const { i18n } = useTranslation();
  return i18n.getFixedT(process && process.language);
};

export const useCustomTranslation = (language) => {
  const { i18n } = useTranslation();
  const { process } = useSelector((state) => state.process);
  let finalLang = '';
  if (language) {
    finalLang = language;
  } else if (!language && process) {
    finalLang = process.language;
  } else {
    finalLang = getLanguage();
  }
  return i18n.getFixedT(finalLang);
};

export default useDependantTranslation;

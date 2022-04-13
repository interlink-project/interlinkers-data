import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const useDependantTranslation = () => {
    const { process } = useSelector((state) => state.process);
    const { i18n } = useTranslation()
    return i18n.getFixedT(process && process.language);
};

export default useDependantTranslation;

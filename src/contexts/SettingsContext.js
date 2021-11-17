import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { THEMES } from '../constants';
import { setLanguage } from '../translations/i18n';

const initialSettings = {
  direction: 'ltr',
  theme: THEMES.LIGHT.key,
  language: 'en',
};

export const restoreSettings = () => {
  let settings = null;

  try {
    const storedData = window.localStorage.getItem('settings');

    if (storedData) {
      settings = JSON.parse(storedData);
    } else {
      settings = {
        direction: 'ltr',
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches
          ? THEMES.DARK.key
          : THEMES.LIGHT.key,
      };
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return settings;
};

export const storeSettings = (settings) => {
  window.localStorage.setItem('settings', JSON.stringify(settings));
};

const SettingsContext = createContext({
  settings: initialSettings,
  saveSettings: () => {},
});

export const SettingsProvider = (props) => {
  const { children } = props;
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    const restoredSettings = restoreSettings();

    if (restoredSettings) {
      setSettings(restoredSettings);
    }
  }, []);

  const saveSettings = (updatedSettings) => {
    setSettings(updatedSettings);
    storeSettings(updatedSettings);
    if (settings.language !== updatedSettings.language) {
      setLanguage(updatedSettings.language);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;

import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { createCustomTheme } from 'theme';
import { THEMES } from '../constants';
import { getLanguage, setLanguage } from '../translations/i18n';

const initialSettings = {
  loaded: false,
  direction: 'ltr',
  theme: THEMES.LIGHT.key,
  themeData: createCustomTheme({
    direction: 'ltr',
    theme: THEMES.LIGHT.key,
    paletteCustomData: {
      "light": {
        "action": {
          "active": "#6b778c"
        },
        "background": {
          "default": "#f4f5f7",
          "paper": "#ffffff"
        },
        "error": {
          "contrastText": "#ffffff",
          "main": "#f44336"
        },
        "primary": {
          "contrastText": "#ffffff",
          "main": "#0f97c7"
        },
        "secondary": {
          "contrastText": "#000000",
          "main": "#aa00de"
        },
        "success": {
          "contrastText": "#ffffff",
          "main": "#44c949",
          "secondary": "#0ca811"
        },
        "text": {
          "primary": "#172b4d",
          "secondary": "#6b778c"
        },
        "warning": {
          "contrastText": "#ffffff",
          "main": "#ff9800"
        },
        "progressBarColor": "#d822a3"
      },
      "dark": {
        "background": {
          "default": "#1c2531",
          "paper": "#293142"
        },
        "divider": "rgba(145, 158, 171, 0.24)",
        "error": {
          "contrastText": "#ffffff",
          "main": "#f44336"
        },
        "primary": {
          "contrastText": "#ffffff",
          "main": "#0f97c7"
        },
        "secondary": {
          "contrastText": "#000000",
          "main": "#aa00de"
        },
        "success": {
          "contrastText": "#ffffff",
          "main": "#4caf50",
          "secondary": "#1ac420"
        },
        "text": {
          "primary": "#ffffff",
          "secondary": "#919eab"
        },
        "warning": {
          "contrastText": "#ffffff",
          "main": "#ff9800"
        },
        "progressBarColor": "#d822a3"
      }
    }
  }),
  logos: {},

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
  saveSettings: () => { },
});

export const SettingsProvider = (props) => {
  const { children } = props;
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    const newSettigns = restoreSettings() || initialSettings;

    console.log("mira", newSettigns)
    fetch("/static/customization/settings.json")
      .then(r => r.json())
      .then(json => {
        console.log("GOT SETTINGS", json)
        newSettigns.themeData = createCustomTheme({
          direction: newSettigns.direction,
          theme: newSettigns.theme,
          paletteCustomData: json.palette
        })
        newSettigns.logos = json.logos
        newSettigns.loaded = true
        setSettings(newSettigns);
      })
  }, []);

  const saveSettings = (updatedSettings) => {
    const newSettigns = { ...settings }
    if (settings.theme !== updatedSettings.theme) {
      newSettigns.theme = updatedSettings.theme
      newSettigns.themeData = createCustomTheme({
        direction: settings.direction,
        theme: updatedSettings.theme,
        paletteCustomData: settings.themeData.paletteCustomData
      })
      newSettigns.loaded = true
      console.log("SAVING ", newSettigns)
      setSettings(newSettigns);
      storeSettings(newSettigns);
    }

    if (getLanguage() !== updatedSettings.language) {
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

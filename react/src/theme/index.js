import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import merge from 'lodash/merge';
import { THEMES } from '../constants';
import { darkShadows, lightShadows } from './shadows';

export const createCustomTheme = (config = {}) => {
  const baseOptions = {
    direction: 'ltr',
    components: {
      MuiAvatar: {
        styleOverrides: {
          fallback: {
            height: '75%',
            width: '75%'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none'
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box'
          },
          html: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            height: '100%',
            width: '100%'
          },
          body: {
            height: '100%'
          },
          '#root': {
            height: '100%'
          },
          '#nprogress .bar': {
            zIndex: '2000 !important',
            background: `${config.paletteCustomData[config.theme === THEMES.LIGHT.key ? 'light' : 'dark'].progressBarColor} !important`
          }
        }
      },
      MuiCardHeader: {
        defaultProps: {
          titleTypographyProps: {
            variant: 'h6'
          }
        }
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 'auto',
            marginRight: '16px'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none'
          }
        }
      }
    },
    typography: {
      button: {
        fontWeight: 600
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      h1: {
        fontWeight: 600,
        fontSize: '3.5rem'
      },
      h2: {
        fontWeight: 600,
        fontSize: '3rem'
      },
      h3: {
        fontWeight: 600,
        fontSize: '2.25rem'
      },
      h4: {
        fontWeight: 600,
        fontSize: '2rem'
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.5rem'
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem'
      },
      overline: {
        fontWeight: 600
      }
    }
  };

  const themesOptions = {
    [THEMES.LIGHT.key]: {
      components: {
        MuiInputBase: {
          styleOverrides: {
            input: {
              '&::placeholder': {
                opacity: 0.86,
                color: '#42526e'
              }
            }
          }
        }
      },
      palette: {
        ...config.paletteCustomData.light,
        mode: 'light'
      },
      shadows: lightShadows
    },
    [THEMES.DARK.key]: {
      components: {
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderBottom: '1px solid rgba(145, 158, 171, 0.24)'
            }
          }
        }
      },
      palette: {
        ...config.paletteCustomData.dark,
        mode: 'dark'
      },
      shadows: darkShadows
    },
  };
  let themeOptions = themesOptions[config.theme];

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    themeOptions = themesOptions[THEMES.LIGHT.key];
  }

  let theme = createTheme(merge({}, baseOptions, themeOptions, {
    direction: config.direction
  }));

  theme = responsiveFontSizes(theme);
  return { ...theme, paletteCustomData: config.paletteCustomData };
};

import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Popover,
  IconButton,
} from '@material-ui/core';
import { THEMES } from '../../constants';
import { getLanguage, LANGUAGES } from 'translations/i18n';
import useSettings from '../../hooks/useSettings';
import AdjustmentsIcon from '../../icons/Adjustments';
import { useTranslation } from 'react-i18next';
import { OpenInNew, Settings } from '@material-ui/icons';

const getValues = (settings) => ({
  direction: settings.direction,
  theme: settings.theme,
  showHelp: settings.showHelp,
  language: getLanguage()
});

const SettingsPopover = () => {
  const anchorRef = useRef(null);
  const { settings, saveSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(getValues(settings));
  const {t} = useTranslation()

  useEffect(() => {
    setValues(getValues(settings));
  }, [settings]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field, value) => {
    setValues({
      ...values,
      [field]: value,
    });
  };

  const handleSave = () => {
    saveSettings(values);
    setOpen(false);
  };

  return (
    <>
      {' '}
      <Tooltip title='Settings'>
        <IconButton color='inherit' ref={anchorRef} onClick={handleOpen}>
          <Settings fontSize='small' />
        </IconButton>
      </Tooltip>{' '}
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        {' '}
        <Box
          sx={{
            p: 2,
          }}
        >
          <TextField
            fullWidth
            label={t("Theme")}
            name='theme'
            onChange={(event) => handleChange('theme', event.target.value)}
            select
            SelectProps={{
              native: true,
            }}
            value={values.theme}
            variant='outlined'
          >
            {Object.keys(THEMES).map((key) => (
              <option key={key} value={key}>
                {THEMES[key].label()[0] +
                  THEMES[key].label().substr(1).toLowerCase()}
              </option>
            ))}
          </TextField>
        </Box>{' '}
        <Box sx={{ p: 2 }}>
          {' '}
          <TextField
            fullWidth
            label={t("Language")}
            name='language'
            onChange={(event) => handleChange('language', event.target.value)}
            select
            SelectProps={{
              native: true,
            }}
            value={values.language}
            variant='outlined'
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </TextField>{' '}
        </Box>
        <Box sx={{ my: 2, mx: 2 }}>
          <Button startIcon={<OpenInNew />} fullWidth variant="text" onClick={() => window.open(`/docs/${getLanguage()}/`, "_blank")}>{t("Open user manual")}</Button>
          </Box>
          <Box sx={{ my: 2, mx: 2 }}>
          <Button startIcon={<OpenInNew />} fullWidth variant="text" onClick={() => window.open(`/docs/${getLanguage()}/`, "_blank")}>{t("Contact form")}</Button>
          </Box>
          <Box sx={{ my: 2, mx: 2 }}>
          <Button startIcon={<OpenInNew />} fullWidth variant="text" onClick={() => window.open(`/docs/${getLanguage()}/`, "_blank")}>{t("Usability form")}</Button>
          </Box>
        <Box sx={{ px: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={values.showHelp}
                color='primary'
                edge='start'
                name='showHelp'
                onChange={(event) =>
                  handleChange(
                    'showHelp',
                    event.target.checked
                  )
                }
              />
            }
            label={t("Show contextual help")}
          />
          </Box>
        <Box
          sx={{
            p: 2,
          }}
        >
          <Button
            color='primary'
            fullWidth
            onClick={handleSave}
            variant='contained'
          >
            {t("Save")}
          </Button>
        </Box>{' '}
      </Popover>
    </>
  );
};

export default SettingsPopover;

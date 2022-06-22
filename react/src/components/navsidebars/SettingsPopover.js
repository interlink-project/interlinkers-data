import {
  Box,
  Button, IconButton, Popover, TextField, Tooltip
} from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguage, LANGUAGES } from 'translations/i18n';
import { THEMES } from '../../constants';
import useSettings from '../../hooks/useSettings';

const getValues = (settings) => ({
  // direction: settings.direction,
  theme: settings.theme,
  language: getLanguage()
});

const SettingsPopover = () => {
  const anchorRef = useRef(null);
  const { settings, saveSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);
  const [values, setValues] = useState(getValues(settings));

  const ENVIRONMENT = window.location

  const { t } = useTranslation()

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

  const onLoad = function () {
    console.log("Iframe refreshed", openDialog, this)
  }

  return (
    <>
      {' '}
      <Tooltip title={t('Settings')}>
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

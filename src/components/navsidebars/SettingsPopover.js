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
import { THEMES, LANGUAGES } from '../../constants';
import useSettings from '../../hooks/useSettings';
import AdjustmentsIcon from '../../icons/Adjustments';

const getValues = (settings) => ({
  direction: settings.direction,
  theme: settings.theme,
  language: settings.language,
});

const SettingsPopover = () => {
  const anchorRef = useRef(null);
  const { settings, saveSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(getValues(settings));

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
          <AdjustmentsIcon fontSize='small' />
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
            label='Theme'
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
            label='Language'
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
        {/* <Box sx={{ p: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={values.direction === 'rtl'}
                color='primary'
                edge='start'
                name='direction'
                onChange={(event) =>
                  handleChange(
                    'direction',
                    event.target.checked ? 'rtl' : 'ltr'
                  )
                }
              />
            }
            label={
              <div>
                {' '}
                RTL{' '}
                <Typography
                  color='textSecondary'
                  component='p'
                  variant='caption'
                >
                  {' '}
                  Change text direction{' '}
                </Typography>
              </div>
            }
          />
          </Box> */}
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
            Save Settings
          </Button>
        </Box>{' '}
      </Popover>
    </>
  );
};

export default SettingsPopover;

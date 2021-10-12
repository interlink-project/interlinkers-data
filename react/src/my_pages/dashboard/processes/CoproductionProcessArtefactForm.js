import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import {
  Box,
  Button,
  Card,
  Chip,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  Grid,
} from '@material-ui/core';

const CoproductionProcessArtefactForm = (props) => {
  const {
    onBack,
    onNext,
    artefact,
    setArtefact,
    artefact_type,
    ...other
  } = props;

  const shape =
    artefact_type === 'interlinker'
      ? {
          nature: Yup.string().required('Required'),
        }
      : {};

  return (
    <Formik
      initialValues={artefact}
      validationSchema={Yup.object().shape(shape)}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          console.log(values);
          /*
          setArtefact(values);
          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }*/
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit} {...other}>
          {artefact_type === 'interlinker' ? (
            <Grid container sx={{ p: 1 }}>
              <Grid item md={6} xs={12}>
                <Box
                  sx={{
                    justifyContent: 'center',
                    display: 'flex',
                    mt: 2,
                  }}
                >
                  <Typography color='textPrimary' variant='overline'>
                    Nature
                  </Typography>
                </Box>
                <Box
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    mt: 1,
                  }}
                >
                  <ToggleButtonGroup
                    exclusive
                    onChange={(event, value) => {
                      if (value) {
                        setFieldTouched('nature');
                        setFieldValue('nature', value);
                      }
                    }}
                    value={values.nature}
                    fullWidth
                    label='Nature'
                    name='nature'
                    color='standard'
                    size='medium'
                  >
                    <ToggleButton value='software'>Software</ToggleButton>
                    <ToggleButton value='knowledge'>Knowledge</ToggleButton>
                  </ToggleButtonGroup>
                  {Boolean(touched.nature && errors.nature) && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>{errors.nature}</FormHelperText>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item md={6} xs={12} sx={{ p: 2 }}>
                eo
              </Grid>
            </Grid>
          ) : null}
          <Box
            sx={{
              display: 'flex',
              mt: 6,
            }}
          >
            {onBack && (
              <Button
                color='primary'
                onClick={onBack}
                size='large'
                variant='text'
              >
                Previous
              </Button>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color='primary'
              disabled={
                Object.keys(touched).length === 0 ||
                isSubmitting ||
                Object.keys(errors).length !== 0
              }
              type='submit'
              variant='contained'
            >
              Complete
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

CoproductionProcessArtefactForm.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};

export default CoproductionProcessArtefactForm;

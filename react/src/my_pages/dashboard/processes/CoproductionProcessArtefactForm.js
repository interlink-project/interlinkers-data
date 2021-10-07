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
  Paper,
} from '@material-ui/core';
import { problemdomainsApi } from '../../../__fakeApi__/problemDomains';
import useMounted from '../../../hooks/useMounted';

const CoproductionProcessArtefactForm = (props) => {
  const {
    onBack,
    onNext,
    artefact,
    setArtefact,
    artefact_type,
    ...other
  } = props;
  console.log(props);
  const [problemDomains, setProblemDomains] = useState(null);
  const mounted = useMounted();

  const getProblemDomains = useCallback(async () => {
    try {
      const data = await problemdomainsApi.getProblemDomains();

      if (mounted.current) {
        setProblemDomains(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getProblemDomains();
  }, [getProblemDomains]);

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
          setArtefact(values);
          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }
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
          <Card sx={{ mt: 3, p: 2 }}>
            <Typography color='textPrimary' variant='h6'>
              Details of the{' '}
              {artefact_type === 'interlinker'
                ? 'interlinker'
                : 'public service'}
            </Typography>

            {artefact_type === 'interlinker' ? (
              <Box sx={{ mt: 2 }}>
                <Grid container>
                  <Grid item md={6} xs={12}>
                    <Box
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        mt: 3,
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
                  <Grid item md={6} xs={12}>
                    <Box
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        mt: 3,
                      }}
                    >
                      <Autocomplete
                        disablePortal
                        options={
                          problemDomains
                            ? problemDomains.map((el) => {
                                return {
                                  label: el.name,
                                  value: el.id,
                                };
                              })
                            : []
                        }
                        fullWidth
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(
                              touched.problemdomain && errors.problemdomain
                            )}
                            fullWidth
                            label='Problem domain'
                            name='problemdomain'
                            onClick={() => setFieldTouched('problemdomain')}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.problemdomain}
                            variant='outlined'
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
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
          </Card>
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

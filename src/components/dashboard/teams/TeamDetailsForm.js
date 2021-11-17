import { useState } from 'react';
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
  Typography
} from '@material-ui/core';
import PlusIcon from '../../../icons/Plus';

const TeamDetailsForm = (props) => {
  const { onBack, onNext, ...other } = props;
  const [tag, setTag] = useState('');

  return (
    <Formik
      initialValues={{
        teamName: '',
        keywords: ['Full-Time'],
        startDate: new Date(),
        endDate: new Date(),
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          teamName: Yup
            .string()
            .min(3, 'Must be at least 3 characters')
            .max(255)
            .required('Required'),
          keywords: Yup.array(),
          startDate: Yup.date(),
          endDate: Yup.date()
        })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }
        } catch (err) {
          console.error(err);
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
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          {...other}
        >
          <Card sx={{ p: 3 }}>
            <Typography
              color='textPrimary'
              variant='h6'
            >
              Team details
            </Typography>
            <Typography
              color='textSecondary'
              variant='body1'
            >
              Proin tincidunt lacus sed ante efficitur efficitur.
              Quisque aliquam fringilla velit sit amet euismod.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(touched.teamName && errors.teamName)}
                fullWidth
                helperText={touched.teamName && errors.teamName}
                label='Team Name'
                name='teamName'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.teamName}
                variant='outlined'
              />
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  mt: 3
                }}
              >
                <TextField
                  fullWidth
                  label='Keywords'
                  name='keywords'
                  onChange={(event) => setTag(event.target.value)}
                  value={tag}
                  variant='outlined'
                />
                <IconButton
                  sx={{ ml: 2 }}
                  onClick={() => {
                    if (!tag) {
                      return;
                    }

                    setFieldValue('keywords', [
                      ...values.keywords,
                      tag
                    ]);
                    setTag('');
                  }}
                >
                  <PlusIcon fontSize='small' />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2 }}>
                {values.keywords.map((_tag, i) => (
                  <Chip
                    onDelete={() => {
                      const newKeywords = values.keywords.filter((t) => t !== _tag);

                      setFieldValue('keywords', newKeywords);
                    }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    label={_tag}
                    sx={{
                      '& + &': {
                        ml: 1
                      }
                    }}
                    variant='outlined'
                  />
                ))}
              </Box>
              {Boolean(touched.keywords && errors.keywords) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {errors.keywords}
                  </FormHelperText>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  mt: 4
                }}
              >
                <Box sx={{ mr: 2 }}>
                  <MobileDatePicker
                    label='Start Date'
                    onAccept={() => setFieldTouched('startDate')}
                    onChange={(date) => setFieldValue('startDate', date)}
                    onClose={() => setFieldTouched('startDate')}
                    renderInput={(inputProps) => (
                      <TextField
                        variant='outlined'
                        {...inputProps}
                      />
                    )}
                    value={values.startDate}
                  />
                </Box>
                <MobileDatePicker
                  label='End Date'
                  onAccept={() => setFieldTouched('endDate')}
                  onChange={(date) => setFieldValue('endDate', date)}
                  onClose={() => setFieldTouched('endDate')}
                  renderInput={(inputProps) => (
                    <TextField
                      variant='outlined'
                      {...inputProps}
                    />
                  )}
                  value={values.endDate}
                />
              </Box>
              {Boolean(touched.startDate && errors.startDate) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {errors.startDate}
                  </FormHelperText>
                </Box>
              )}
              {Boolean(touched.endDate && errors.endDate) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {errors.endDate}
                  </FormHelperText>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                mt: 6
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
                disabled={isSubmitting}
                type='submit'
                variant='contained'
              >
                Next
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

TeamDetailsForm.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};

export default TeamDetailsForm;

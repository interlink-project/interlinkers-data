import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import {
  Box,
  Button,
  Card,
  FormHelperText,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  Avatar,
} from '@material-ui/core';
import QuillEditor from '../../../components/QuillEditor';
import { getImageUrl } from 'axiosInstance';

const CoproductionProcessDetailsForm = (props) => {
  const {
    onBack,
    onNext,
    details,
    setDetails,
    teams,
    ...other
  } = props;

  const [teamAvatar, setTeamAvatar] = useState(null);

  return (
    <Formik
      initialValues={details}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .min(3, 'Must be at least 3 characters')
          .max(255)
          .required('Required'),
        description: Yup.string()
          .min(22, 'Must be at least 15 characters')
          // min 22 bc <p></p> tags are 7 chars
          .required('Required'),
        keywords: Yup.array(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          setDetails(values);
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
          <Box sx={{ mt: 2 }}>
            <Box>
              <TextField
                required
                error={Boolean(touched.name && errors.name)}
                fullWidth
                helperText={touched.name && errors.name}
                label='Name'
                name='name'
                onBlur={handleBlur}
                onChange={handleChange}
                onClick={() => setFieldTouched('name')}
                value={values.name}
                variant='outlined'
              />
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                mt: 3,
              }}
            >
              <Autocomplete
                disablePortal
                options={teams || []}
                getOptionLabel={(option) => option.name}
                onChange={(event, val) => {
                  if (val) {
                    setTeamAvatar(val.logotype);
                    setFieldValue('team_id', val.id);
                  }
                }}
                fullWidth
                disabled={!teams}
                renderInput={(params) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      alt='Avatar'
                      src={getImageUrl("users", teamAvatar)}
                      sx={{ mr: 2 }}
                    />
                    <TextField
                      {...params}
                      error={Boolean(touched.team_id && errors.team_id)}
                      disabled={!teams}
                      fullWidth
                      label='Team'
                      name='team_id'
                      onClick={() => setFieldTouched('team_id')}
                      onBlur={handleBlur}
                      value={values.team_id}
                      variant='outlined'
                    />
                  </Box>
                )}
              />
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                mt: 3,
              }}
            >
              <QuillEditor
                required
                error={Boolean(touched.description && errors.description)}
                label='Description'
                name='description'
                onChange={(val) => setFieldValue('description', val)}
                onClick={() => setFieldTouched('description')}
                placeholder='Write here a description'
                sx={{ height: 400, width: '100%' }}
                value={values.description}
              />
            </Box>
            {Boolean(errors.description) && (
              <Box sx={{ mt: 2 }}>
                <FormHelperText error>{errors.description}</FormHelperText>
              </Box>
            )}

            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                mt: 3,
              }}
            >
              <Autocomplete
                multiple
                disablePortal
                options={['demo', 'demo2', 'demo3']}
                onChange={(event, val) => {
                  setFieldValue('keywords', val);
                }}
                fullWidth
                freeSolo
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(touched.keywords && errors.keywords)}
                    fullWidth
                    label='Keywords'
                    name='keywords'
                    onClick={() => setFieldTouched('keywords')}
                    onBlur={handleBlur}
                    value={values.keywords}
                    variant='outlined'
                  />
                )}
              />
            </Box>
          </Box>
          
        </form>
      )}
    </Formik>
  );
};

CoproductionProcessDetailsForm.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};

export default CoproductionProcessDetailsForm;

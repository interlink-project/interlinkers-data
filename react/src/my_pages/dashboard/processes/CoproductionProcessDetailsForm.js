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
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@material-ui/core';
import PlusIcon from '../../../icons/Plus';
import QuillEditor from '../../../my_components/QuillEditor';

const CoproductionProcessDetailsForm = (props) => {
  const { onBack, onNext, details, setDetails, ...other } = props;
  const [tag, setTag] = useState('');

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
        artefact_type: Yup.string().required('Field is required'),
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
          <Card sx={{ p: 3 }}>
            <Typography color='textPrimary' variant='h6' sx={{ mb: 3 }}>
              Coproduction process details
            </Typography>
            <Box sx={{ mt: 2 }}>
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
                <TextField
                  fullWidth
                  label='Keywords'
                  name='keywords'
                  onClick={() => setFieldTouched('keywords')}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      setFieldValue('keywords', [...values.keywords, tag]);
                      setTag('');
                    }
                  }}
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

                    setFieldValue('keywords', [...values.keywords, tag]);
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
                      const newKeywords = values.keywords.filter(
                        (t) => t !== _tag
                      );

                      setFieldValue('keywords', newKeywords);
                    }}
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    label={_tag}
                    sx={{
                      '& + &': {
                        ml: 1,
                      },
                    }}
                    variant='outlined'
                  />
                ))}
              </Box>
              {Boolean(touched.keywords && errors.keywords) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>{errors.keywords}</FormHelperText>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <Typography color='textPrimary' variant='overline'>
                Artefact type
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
                    setFieldTouched('artefact_type');
                    setFieldValue('artefact_type', value);
                  }
                }}
                value={values.artefact_type}
                fullWidth
                color={
                  values.artefact_type === 'interlinker'
                    ? 'primary'
                    : 'secondary'
                }
                label='Artefact type'
                name='artefact_type'
                size='large'
              >
                <ToggleButton value='interlinker'>Interlinker</ToggleButton>
                <ToggleButton value='publicservice'>
                  Public service
                </ToggleButton>
              </ToggleButtonGroup>
              {Boolean(touched.artefact_type && errors.artefact_type) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>{errors.artefact_type}</FormHelperText>
                </Box>
              )}
            </Box>
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
                Next
              </Button>
            </Box>
          </Card>
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

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
import PlusIcon from '../../../../icons/Plus';

const TeamDetailsForm = (props) => {
  const { onBack, onNext, ...other } = props;
  const [tag, setTag] = useState('');

  return (
    <Formik
      initialValues={{
        name: '',
        tags: [],
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          name: Yup
            .string()
            .min(3, 'Must be at least 3 characters')
            .max(255)
            .required('Required'),
          tags: Yup.array(),
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
                error={Boolean(touched.name && errors.name)}
                fullWidth
                helperText={touched.name && errors.name}
                label='Team Name'
                name='name'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
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
                  label='Tags'
                  name='tags'
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

                    setFieldValue('tags', [
                      ...values.tags,
                      tag
                    ]);
                    setTag('');
                  }}
                >
                  <PlusIcon fontSize='small' />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2 }}>
                {values.tags.map((_tag, i) => (
                  <Chip
                    onDelete={() => {
                      const newTags = values.tags.filter((t) => t !== _tag);

                      setFieldValue('tags', newTags);
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
              {Boolean(touched.tags && errors.tags) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {errors.tags}
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

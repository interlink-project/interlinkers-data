import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  TextField,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
} from '@material-ui/core';
import Logo from '../../my_components/Logo';
import useAuth from '../../hooks/useAuth';
import gtm from '../../lib/gtm';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useMounted from '../../hooks/useMounted';

const Login = (props) => {
  const { platform } = useAuth();
  const mounted = useMounted();
  const auth = useAuth();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container
          maxWidth='sm'
          sx={{ py: '80px' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 8,
            }}
          >
            <RouterLink to='/'>
              <Logo
                sx={{
                  height: 40,
                  width: 40,
                }}
              />
            </RouterLink>
          </Box>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 4,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <div>
                  <Typography
                    color='textPrimary'
                    gutterBottom
                    variant='h4'
                  >
                    Log in
                  </Typography>
                  <Typography
                    color='textSecondary'
                    variant='body2'
                  >
                    Log in on the internal platform
                  </Typography>
                </div>
                <Box
                  sx={{
                    height: 32,
                    '& > img': {
                      maxHeight: '100%',
                      width: 'auto',
                    },
                  }}
                >
                  <img
                    alt='Auth platform'
                    src='/static/icons/oidc.svg'
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                <Formik
                  initialValues={{
                    email: 'demo@interlink.io',
                    password: 'Password123!',
                    submit: null,
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email('Must be a valid email')
                      .max(255)
                      .required('Email is required'),
                    password: Yup.string()
                      .max(255)
                      .required('Password is required'),
                  })}
                  onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      await auth.login(values.email, values.password);

                      if (mounted.current) {
                        setStatus({ success: true });
                        setSubmitting(false);
                      }
                    } catch (err) {
                      console.error(err);
                      if (mounted.current) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                      }
                    }
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <form
                      noValidate
                      onSubmit={handleSubmit}
                      {...props}
                    >
                      <TextField
                        autoFocus
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label='Email Address'
                        margin='normal'
                        name='email'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type='email'
                        value={values.email}
                        variant='outlined'
                      />
                      <TextField
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        label='Password'
                        margin='normal'
                        name='password'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type='password'
                        value={values.password}
                        variant='outlined'
                      />
                      {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                      )}
                      <Box sx={{ mt: 2 }}>
                        <Alert severity='info'>
                          <div>
                            Use
                            {' '}
                            <b>demo@interlink.io</b>
                            {' '}
                            and password
                            {' '}
                            <b>Password123!</b>
                          </div>
                        </Alert>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          color='primary'
                          disabled={isSubmitting}
                          fullWidth
                          size='large'
                          type='submit'
                          variant='contained'
                        >
                          Log In
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
                <Box
                  sx={{
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <Divider />
                </Box>
                <Button
                  color='secondary'
                  onClick={() => auth.signinRedirect()}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                >
                  Log In with OIDC
                </Button>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Link
                color='textSecondary'
                component={RouterLink}
                to='/authentication/register'
                variant='body2'
              >
                Create new account
              </Link>
              {platform === 'Amplify' && (
                <Link
                  color='textSecondary'
                  component={RouterLink}
                  sx={{ mt: 1 }}
                  to='/authentication/password-recovery'
                  variant='body2'
                >
                  Forgot password
                </Link>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;

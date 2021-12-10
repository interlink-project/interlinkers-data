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
import Logo from '../../components/Logo';
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
              
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
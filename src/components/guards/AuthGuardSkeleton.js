import { Paper, Button, Typography, Box, Card, CardContent, useMediaQuery } from '@material-ui/core';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';
import { styled } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';

const AuthGuardSkeleton = ({ children, width = "100%", height = "100%" }) => {
  const auth = useAuth();
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  if (!auth.isAuthenticated) {
    return  <Box
        style={{
          bgcolor: "background.paper",
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
          <Typography
            align='center'
            color='textPrimary'
            variant={mobileDevice ? 'h4' : 'h2'}
          >
            Login required
          </Typography>
          <Typography
            align='center'
            color='textSecondary'
            sx={{ mt: 0.5 }}
            variant='subtitle2'
          >
            You must be logged in to access this section.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          ><Box
              alt='Under development'
              component='img'
              src={`/static/error/error401_${theme.palette.mode}.svg`}
              sx={{
                height: 'auto',
                maxWidth: '100%',
                width: 200
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            <Button
              color='primary'
              onClick={() => auth.signinRedirect()}
              variant='outlined'
            >
              Login
            </Button>
          </Box>
          </Box>
  }
  return <>{children}</>;
};

AuthGuardSkeleton.propTypes = {
  children: PropTypes.node
};

export default AuthGuardSkeleton;

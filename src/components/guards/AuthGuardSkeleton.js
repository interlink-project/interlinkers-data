import { Paper, Button, Typography, Box, Card, CardContent } from '@material-ui/core';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';
import { styled } from '@material-ui/styles';

const AuthGuardSkeleton = ({ children, width, height }) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Box sx={{ width, height }}>
      <Card>
        <CardContent>
          <Typography variant="h4">You must be logged in to see this section</Typography>
          <Button onClick={() => auth.signinRedirect()}>Log in</Button>
        </CardContent>

      </Card>
    </Box>
  }
  return <>{children}</>;
};

AuthGuardSkeleton.propTypes = {
  children: PropTypes.node
};

export default AuthGuardSkeleton;

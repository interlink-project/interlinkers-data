import {
  Alert, Box, Container,
  Grid, Typography
} from '@material-ui/core';
import AuthGuardSkeleton from 'components/guards/AuthGuardSkeleton';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import useAuth from '../../hooks/useAuth';

const MyWorkspace = () => {
  const auth = useAuth();
  const { user } = auth;

  const LoggedInWorkspace = () => <> <Grid container spacing={3}>
    <Grid container justifyContent='space-between' item xs={12}>
      <Grid item>
        <Typography color='textSecondary' variant='overline'>
          MyWorkspace
        </Typography>
        <Typography color='textPrimary' variant='h5'>
          Welcome, {user.given_name}
        </Typography>
        <Typography color='textSecondary' variant='subtitle2'>
          Here&apos;s the recent activity related to your workspace
        </Typography>
      </Grid>
    </Grid>
  </Grid>
    <Alert sx={{ mt: 3 }} severity="warning">Not implemented yet</Alert>

  </>

  return (
    <>
      <Helmet>
        <title>Dashboard: MyWorkspace</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
          px: 2,
        }}
      >
        <Container maxWidth='lg'>
          <AuthGuardSkeleton height="60vh" width="100%">
            <LoggedInWorkspace />
          </AuthGuardSkeleton>
        </Container>
      </Box>
    </>
  );
};

export default MyWorkspace;

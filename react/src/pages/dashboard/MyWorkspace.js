import {
  Alert, Box, Card, Container,
  Grid, Stack, Typography
} from '@material-ui/core';
import { ArrowBack, ArrowLeft } from '@material-ui/icons';
import AuthGuardSkeleton from 'components/guards/AuthGuardSkeleton';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';

const MyWorkspace = () => {
  const auth = useAuth();
  const { user } = auth;
  const { teams, processes, loadingTeams, loadingProcesses } = useSelector((state) => state.general);
  const { t } = useTranslation()

  const LoggedInWorkspace = () => <Container maxWidth="lg">
    <>
    <Grid container spacing={3}>
      <Grid container justifyContent='space-between' item xs={12}>
        <Grid item>
          <Typography color='textSecondary' variant='overline'>
            {t("Workspace")}
          </Typography>
          <Typography color='textPrimary' variant='h5'>
            {t("Welcome", {
              who: user.given_name
            })}
          </Typography>
          <Typography color='textSecondary' variant='subtitle2'>
            {t("workspace-subtitle")}
          </Typography>
        </Grid>
      </Grid>
    </Grid>

    {loadingProcesses || <Box sx={{mt: 3}}>
      {processes.length > 0 ? <Alert severity='warning'>Not implemented yet</Alert> : <Container sx={{ mt: 6 }}>
        <Stack sx={{ mt: 3 }} direction="row" alignItems="center" component={Card}>
          <ArrowBack sx={{ fontSize: 150 }} />
          <Typography color='textSecondary' variant='h6'>
            {t("workspace-emptyprocesses")}
          </Typography>
        </Stack>
      </Container>}</Box>}
      </>
  </Container>

  return (
    <>
      <Helmet>
        <title>{t("workspace-title")}</title>
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

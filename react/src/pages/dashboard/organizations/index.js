import { Box, Container, Grid, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import useAuth from 'hooks/useAuth';
import useMounted from 'hooks/useMounted';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getOrganizations } from 'slices/general';
import OrganizationCreate from './OrganizationCreate';
import OrganizationProfile from './OrganizationProfile';
import OrganizationsList from './OrganizationsList';
import TeamProfile from './TeamProfile';

const Organizations = () => {
  const { t } = useTranslation()

  const [searchValue, setSearchValue] = React.useState("");
  const { organizations, loadingOrganizations } = useSelector((state) => state.general);
  const [organizationCreatorOpen, setOrganizationCreatorOpen] = React.useState(false);
  const [organizationLoading, setOrganizationLoading] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState(null);

  const dispatch = useDispatch();
  const mounted = useMounted();

  const { isAuthenticated } = useAuth()

  const getOrganizationsData = React.useCallback(async (search) => {
    dispatch(getOrganizations(search))

  }, [mounted]);

  React.useEffect(() => {
    var delayDebounceFn
    if (mounted.current) {
      delayDebounceFn = setTimeout(() => {
        getOrganizationsData(searchValue)
      }, searchValue ? 800 : 0)
    }
    return () => {
      if (delayDebounceFn) {
        clearTimeout(delayDebounceFn)
      }
    }
  }, [getOrganizationsData, searchValue])


  const updateOrganizations = (res) => {
    setSearchValue("")
    getOrganizationsData("")
  }

  return (
    <>
      <Helmet>
        <title>{t("organizations-title")}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5,
          px: 1,
        }}
      >
        <OrganizationCreate
          open={organizationCreatorOpen}
          setOpen={setOrganizationCreatorOpen}
          loading={organizationLoading}
          setLoading={setOrganizationLoading}
          onCreate={updateOrganizations}
        />
        <Container maxWidth='lg'>
          <Grid container
            spacing={3}>
            <Grid alignItems="center"
              container
              justifyContent="space-between"
              spacing={3}
              item
              xs={12}>
              <Grid item>
                <Typography color='textSecondary' variant='overline'>
                  {t("Organizations")}
                </Typography>
                <Typography color='textPrimary' variant='h5'>
                  {t("Organizations and teams present in the platform")}
                </Typography>
                <Typography color='textSecondary' variant='subtitle2'>
                  {t("Here you can find the different organizations that are working on the platform. In each organization teams are created to group the users.")}
                </Typography>
              </Grid>
              <Grid item>
                <LoadingButton onClick={() => setOrganizationCreatorOpen(true)} disabled={!isAuthenticated} loading={loadingOrganizations} fullWidth variant="contained" sx={{ textAlign: "center", mt: 1, mb: 2 }} startIcon={<Add />} size="small">
                  {t("Create new organization")}
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
          {selectedTeam && <TeamProfile teamId={selectedTeam.id} open={selectedTeam ? true : false} setOpen={setSelectedTeam} onChanges={updateOrganizations} />}
          <Box sx={{ mt: 4 }}>
            <OrganizationsList getCollapseElement={(organization) => <OrganizationProfile organizationId={organization.id} onChanges={updateOrganizations} onTeamClick={setSelectedTeam} />} searchValue={searchValue} setSearchValue={setSearchValue} organizations={organizations} loading={loadingOrganizations} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Organizations;

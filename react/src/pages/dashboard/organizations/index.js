import { Avatar, AvatarGroup, Box, Chip, Container, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { Add, Check, KeyboardArrowDown, KeyboardArrowUp, People } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import SearchBox from 'components/SearchBox';
import UserAvatar from 'components/UserAvatar';
import useAuth from 'hooks/useAuth';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getOrganizations } from 'slices/general';
import OrganizationCreate from './OrganizationCreate';
import OrganizationProfile from './OrganizationProfile';

function OrganizationRow({ organization, onChanges }) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>

      <TableRow hover={!open} sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }} onClick={() => {
        setOpen(!open)
      }}>
        <TableCell align="center" component="th" scope="row">
          <Stack alignItems="center" direction="row" spacing={1}>
            {organization.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} variant="rounded" src={organization.logotype_link} /> : <People />}
            <b>{organization.name}</b>
          </Stack>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {organization.public && <Check />}
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          <AvatarGroup>
            {organization.administrators.map(admin => <UserAvatar key={admin.id} sx={{ width: 30, height: 30 }} user={admin} />)}
          </AvatarGroup>
        </TableCell>
        <TableCell align="center">{moment(organization.created_at).fromNow()}</TableCell>
        <TableCell align="center">
          {organization.user_participation.length > 0 ? organization.user_participation.map(p => <Chip size="small" sx={{ ml: 1 }} key={organization.id + p} variant={p === "administrator" ? "contained" : "outlined"} label={p} />) : <Chip label={t("None")} />}
        </TableCell>
        <TableCell align="center">
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ border: 0, paddingTop: !open && 0, paddingBottom: !open && 0 }} sx={{ bgcolor: "background.default" }} colSpan={7}>
          <Paper>
            {open && <OrganizationProfile organizationId={organization.id} onChanges={onChanges} />}
          </Paper>
        </TableCell>
      </TableRow >
    </React.Fragment >
  );
}
const Organizations = () => {
  const { t } = useTranslation()
  const navigate = useNavigate();

  const { organizations, loadingOrganizations } = useSelector((state) => state.general);
  const [organizationCreatorOpen, setOrganizationCreatorOpen] = React.useState(false);
  const [organizationLoading, setOrganizationLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const dispatch = useDispatch();
  const mounted = useMounted();

  const {isAuthenticated} = useAuth()

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


  const onOrganizationCreate = (res) => {
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
          onCreate={onOrganizationCreate}
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
          <Box sx={{ mt: 4 }}>
            <Box sx={{ mb: 2 }}>
              <SearchBox loading={loadingOrganizations} inputValue={searchValue} setInputValue={setSearchValue} />

            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{t("Name")}</TableCell>
                    <TableCell align="center">{t("Public")}</TableCell>
                    <TableCell align="center">{t("Administrators")}</TableCell>
                    <TableCell align="center">{t("Created")}</TableCell>
                    <TableCell align="center">{t("Your participation in the organization")}</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organizations.length > 0 && organizations.map((organization) => (
                    <React.Fragment key={organization.id} >
                      <OrganizationRow organization={organization} onChanges={onOrganizationCreate} />
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Organizations;

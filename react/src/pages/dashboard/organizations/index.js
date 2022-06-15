import { Alert, Avatar, Box, Button, Card, CardContent, CardHeader, Chip, Collapse, Container, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { Add, Check, KeyboardArrowDown, KeyboardArrowUp, MoreVert, People } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import { OrganizationChip } from 'components/dashboard/assets/Icons';
import { user_id } from 'contexts/CookieContext';
import useAuth from 'hooks/useAuth';
import useMounted from 'hooks/useMounted';
import moment from 'moment';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getOrganizations } from 'slices/general';
import { organizationsApi } from '__api__';
import TeamProfile from './TeamProfile';
import TeamCreate from './TeamCreate';
import OrganizationCreate from './OrganizationCreate';
import SearchBox from 'components/SearchBox';
import CentricCircularProgress from 'components/CentricCircularProgress';

function OrganizationRow({ organization }) {
  const [teams, setTeams] = React.useState([]);
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const [teamCreatorOpen, setOpenTeamCreator] = React.useState(false);
  const [creatingTeam, setCreatingTeam] = React.useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation()
  const [open, _setOpen] = React.useState(false);

  const getTeams = () => {
    organizationsApi.getOrganizationTeams(organization.id).then(res => {
      setTeams(res)
    })
  }
  const setOpen = (event) => {
    event.stopPropagation();
    _setOpen(!open)
  }

  React.useEffect(() => {
    getTeams()
  }, [])

  const canCreateTeams = organization.team_creation_permission === "anyone" || (organization.team_creation_permission === "administrators" && organization.administrators_ids.includes(user_id))

  return (
    <React.Fragment>
      {selectedTeam && <TeamProfile teamId={selectedTeam.id} open={selectedTeam ? true : false} setOpen={setSelectedTeam} onChanges={getTeams} />}
      <TeamCreate
        open={teamCreatorOpen}
        setOpen={setOpenTeamCreator}
        onCreate={getTeams}
        loading={creatingTeam}
        setLoading={setCreatingTeam}
        organization={organization}
      />
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }} onClick={() => {
        console.log(`/dashboard/organizations/${organization.id}`)
        _setOpen(!open)
      }}>
        <TableCell>
          <Button
            size="small"
            onClick={setOpen}
            startIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            sx={{ fontSize: 13 }}
          >
            {t("Show / hide teams")} ({teams ? teams.length : 0})
          </Button>
        </TableCell>

        <TableCell align="center" component="th" scope="row">
          <Stack alignItems="center" direction="row" spacing={1}>
            {organization.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} variant="rounded" src={organization.logotype_link} /> : <People />}
            <b>{organization.name}</b>{organization.id}
          </Stack>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {organization.public && <Check />}
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          <OrganizationChip type={organization.type} />
        </TableCell>
        <TableCell align="center">{moment(organization.created_at).fromNow()}</TableCell>
        <TableCell align="center">
          {organization.your_participation.length > 0 ? organization.your_participation.map(p => <Chip size="small" sx={{ ml: 1 }} key={organization.id + p} variant={p === "administrator" ? "contained" : "outlined"} label={p} />) : <Chip label={t("None")} />}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ border: 0, paddingTop: !open && 0, paddingBottom: !open && 0 }} sx={{ bgcolor: "background.default" }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Card sx={{ p: 1 }}>
              <CardHeader
                avatar={
                  <Avatar src={organization.logotype_link} />
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVert />
                  </IconButton>
                }
                title={organization.name}
                subheader={organization.description}
              />
              <CardContent>
                <Typography variant="overline">
                  {t("Teams in the organization")}:
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("Name")}</TableCell>
                      <TableCell align="center">{t("Public")}</TableCell>
                      <TableCell align="center">{t("Created")}</TableCell>
                      <TableCell align="center">{t("Users count")}</TableCell>
                      <TableCell align="center">{t("Your participation")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teams && teams.map((team) => (
                      <TableRow sx={{ cursor: 'pointer' }} key={team.id} onClick={() => setSelectedTeam(team)} hover>
                        <TableCell align="center">
                          <Stack alignItems="center" direction="row" spacing={1}>
                            {team.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} variant="rounded" src={team.logotype_link} /> : <People />}
                            <b>{team.name}</b> {team.organization_id}
                          </Stack>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                          {team.public && <Check />}
                        </TableCell>
                        <TableCell align="center">{moment(team.created_at).fromNow()}</TableCell>
                        <TableCell align="center">
                          {team.users_count}
                        </TableCell>
                        <TableCell align="center">
                          {team.your_participation.length > 0 ? team.your_participation.map(p => <Chip size="small" sx={{ mr: 1 }} key={team.id + p} title={`You are ${p} of the organization`} variant={p === "administrator" ? "contained" : "outlined"} label={p} />) : <Chip label={t("None")} />}

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {(!teams || teams.length === 0) && <Alert severity="warning">
                  {t("No teams found in this organization")}
                </Alert>}
                <Stack textAlign="center" sx={{ mt: 3 }}>
                  <LoadingButton sx={{ maxWidth: "300px", textAlign: "center" }} size="small" variant="contained" startIcon={<Add />} onClick={() => setOpenTeamCreator(true)} loading={creatingTeam} disabled={!canCreateTeams} fullWidth>{t("Create new team")}</LoadingButton>
                </Stack>
              </CardContent>
            </Card>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
const Organizations = () => {
  const { t } = useTranslation()
  const navigate = useNavigate();

  const { organizations, loadingOrganizations } = useSelector((state) => state.general);
  const [organizationCreatorOpen, setOrganizationCreatorOpen] = React.useState(false);
  const [organizationLoading, setOrganizationLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const mounted = useMounted();

  const getOrganizationsData = React.useCallback(async () => {
    if (isAuthenticated) {
      dispatch(getOrganizations())

    }
  }, [isAuthenticated, mounted]);

  React.useEffect(() => {
    getOrganizationsData();
  }, [getOrganizationsData]);

  const onOrganizationCreate = (res) => {
    getOrganizationsData()
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
                <LoadingButton onClick={() => setOrganizationCreatorOpen(true)} loading={loadingOrganizations} fullWidth variant="contained" sx={{ textAlign: "center", mt: 1, mb: 2 }} startIcon={<Add />} size="small">
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
                    <TableCell align="center" />
                    <TableCell align="center">{t("Name")}</TableCell>
                    <TableCell align="center">{t("Public")}</TableCell>
                    <TableCell align="center">{t("Type")}</TableCell>
                    <TableCell align="center">{t("Created")}</TableCell>
                    <TableCell align="center">{t("Your participation")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organizations.length > 0 && organizations.map((organization) => (
                    <OrganizationRow key={organization.id} organization={organization} />
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

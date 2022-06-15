import { Avatar, Box, Button, Chip, Container, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { LoadingButton } from '@material-ui/lab';
import AuthGuardSkeleton from 'components/guards/AuthGuardSkeleton';
import useMounted from 'hooks/useMounted';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getMyProcesses, getOrganizations } from 'slices/general';
import useAuth from '../../../hooks/useAuth';
import CoproductionprocessCreate from './CoproductionProcessCreate';

import { Folder } from '@material-ui/icons';
import { StatusChip } from 'components/dashboard/assets/Icons';
import { user_id } from 'contexts/CookieContext';
import moment from 'moment';
import SearchBox from 'components/SearchBox';
import CentricCircularProgress from 'components/CentricCircularProgress';


function ProcessRow({ process }) {
  const navigate = useNavigate();
  return (
    <TableRow key={process.id} hover sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }} onClick={() => navigate(`/dashboard/coproductionprocesses/${process.id}/overview`)}>
      <TableCell align="center">
        {process.logotype_link ? <Avatar sx={{ height: "25px", width: "25px" }} variant="rounded" src={process.logotype_link} /> : <Folder />}
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        <b>{process.name}</b>
      </TableCell>
      <TableCell align="center">{moment(process.created_at).fromNow()}</TableCell>
      <TableCell align="center"><StatusChip status={"in_progress"} /></TableCell>
      <TableCell align="center">
        {process.user_participation.map(p => <Chip label={p} />)}
      </TableCell>
    </TableRow>
  );
}
const MyWorkspace = () => {
  const { processes, loadingProcesses } = useSelector((state) => state.general);
  const [coproductionProcessCreatorOpen, setCoproductionProcessCreatorOpen] = React.useState(false);
  const [coproductionProcessLoading, setCoproductionProcessLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const navigate = useNavigate();

  const { t } = useTranslation()
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { user, isAuthenticated } = useAuth();

  const getProcessesData = React.useCallback(async () => {
    if (isAuthenticated) {
      dispatch(getMyProcesses())

    }
  }, [isAuthenticated, mounted]);

  const getOrganizationsData = React.useCallback(async () => {
    if (isAuthenticated) {
      dispatch(getOrganizations())

    }
  }, [isAuthenticated, mounted]);

  React.useEffect(() => {
    getProcessesData();
    getOrganizationsData();
  }, [getProcessesData, getOrganizationsData]);

  const onProcessCreate = (res) => {
    navigate(`/dashboard/coproductionprocesses/${res.id}/overview`)
  }
  return (
    <>
      <Helmet>
        <title>{t("workspace-title")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5,
          px: 1,
        }}
      >
        <Container maxWidth='lg'>
          <AuthGuardSkeleton height="60vh" width="100%">
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
                    {t("Workspace")}
                  </Typography>
                  <Typography color='textPrimary' variant='h5'>
                    {t("Welcome", {
                      name: user ? user.given_name : ""
                    })}
                  </Typography>
                  <Typography color='textSecondary' variant='subtitle2'>
                    {t("workspace-subtitle")}
                  </Typography>
                </Grid>
                <Grid item>
                  <LoadingButton onClick={() => setCoproductionProcessCreatorOpen(true)} loading={loadingProcesses} fullWidth variant="contained" sx={{ textAlign: "center", mt: 1, mb: 2 }} startIcon={<Add />} size="small">
                    {t("add-process")}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Box sx={{ mb: 2 }}>
                <SearchBox loading={loadingProcesses} inputValue={searchValue} setInputValue={setSearchValue} />

              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" />
                      <TableCell align="center">{t("Name")}</TableCell>
                      <TableCell align="center">{t("Created")}</TableCell>
                      <TableCell align="center">{t("Status")}</TableCell>
                      <TableCell align="center">{t("Your participation in the process")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processes.length > 0 && processes.map((process) => (
                      <React.Fragment key={process.id}>
                      <ProcessRow process={process} />

                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {processes.length === 0 && <>
              {loadingProcesses ? <CentricCircularProgress /> : <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography sx={{ my: 2 }} variant="h5" >
                    {t("We could not find any co-production process")}
                  </Typography>
                  <Button onClick={() => setCoproductionProcessCreatorOpen(true)} sx={{ my: 3, width: 400 }} variant="contained" size="small">Create a new co-production process</Button>
                  <Divider>{t("or")}</Divider>
                  <Button sx={{ my: 3, width: 400 }} variant="contained" color="secondary" size="small">Search for organizations and teams</Button>
                </Paper>}
                

              </>}
              <CoproductionprocessCreate
                open={coproductionProcessCreatorOpen}
                setOpen={setCoproductionProcessCreatorOpen}
                loading={coproductionProcessLoading}
                setLoading={setCoproductionProcessLoading}
                onCreate={onProcessCreate}
              />
            </Box>
          </AuthGuardSkeleton>
        </Container>
      </Box>
    </>
  );
};

export default MyWorkspace;

import {
  Avatar,
  Box, Card, CardHeader, Container, Grid, IconButton,
  Tab, Tabs, Typography, useMediaQuery,
  useTheme
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { MoreVert } from '@material-ui/icons';
import MainSkeleton from 'components/MainSkeleton';
import PermissionDenied from 'components/PermissionDenied';
import useAuth from 'hooks/useAuth';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import RecentActivityTab from 'pages/dashboard/coproductionprocesses/Tabs/RecentActivity';
import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { getProcess, setSelectedTreeItem } from 'slices/process';
import SchemaSelector from '../../../components/dashboard/SchemaSelector';
import useMounted from '../../../hooks/useMounted';
import Guide from './Tabs/Guide';
import TimeLine from './Tabs/Overview';
import SettingsTab from './Tabs/Settings';
import TeamTab from './Tabs/Team';
import Workplan from './Tabs/Workplan';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`coproduction-process-tab-${index}`}
      aria-labelledby={`coproduction-process-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const style = {
  minHeight: '90vh'
}


const TabsMobile = ({ tabs, tab, process }) => {
  const logoExists = process && process.logotype_link
  const navigate = useNavigate();

  return process && <Card sx={{ mb: 1 }}>
    <CardHeader
      avatar={
        <Avatar variant="square" sx={logoExists ? {} : { bgcolor: red[500] }} aria-label="recipe" src={logoExists && process.logotype_link}>
          {process && !logoExists && process.name[0]}
        </Avatar>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVert />
        </IconButton>
      }
      title={process && process.name}
      subheader={process && process.artefact_type}
    />
    <Tabs
      indicatorColor="secondary"
      onChange={(value) => navigate(`/dashboard/coproductionprocesses/${process.id}/${value}`)}
      value={tab}
      aria-label="Coproduction tabs"
      centered
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
        />
      ))}
    </Tabs>
  </Card>
}

const CoproductionProcessProfile = () => {
  let { processId, tab = "overview" } = useParams();
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { user } = useAuth();

  const { process, hasSchema, loading } = useSelector((state) => state.process);

  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('md'));

  const _setSelectedTreeItem = (item, callback) => {
    dispatch(setSelectedTreeItem(item, callback))
  }

  const getCoproductionProcess = useCallback(async () => {
    try {

      if (mounted.current) {
        dispatch(getProcess(processId))
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getCoproductionProcess();
  }, [getCoproductionProcess]);

  const t = useCustomTranslation(process && process.language)

  const tabs = [
    { label: t('Overview'), value: 'overview' },
    { label: t('Recent activity'), value: 'activity' },
    { label: t('Workplan'), value: 'workplan' },
    { label: t('Guide'), value: 'guide' },
    { label: t('Team'), value: 'team' },
    { label: t('Settings'), value: 'settings' },
  ];

  return (
    <>
      <Helmet>
        <title>{t("dashboard-title")}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ mt: 3 }}>
          <Container maxWidth='xl'>
            {onMobile && <TabsMobile tabs={tabs} tab={tab} process={process} />}
            {loading || !process ? <MainSkeleton /> :
              <>
                <TabPanel value={tab} index="overview">
                  <Grid container>
                    <Grid item xs={12} md={12} lg={6} xl={6}>
                      <Card sx={style}>
                        <TimeLine />
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={12} lg={6} xl={6}>
                      <Card sx={style}>
                        <Typography variant="h4" sx={{ textAlign: "center", my: 2 }}>
                          {t("Your pendant actions")}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tab} index="activity">
                  <Card sx={style}>
                    <RecentActivityTab setSelectedTreeItem={_setSelectedTreeItem} coproductionprocess={process} />
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="workplan">
                  <Card sx={{ ...style, mb: 3 }}>
                    <Workplan setSelectedTreeItem={_setSelectedTreeItem} />
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="guide">
                  <Card sx={{ ...style, mb: 3 }}>
                    {!hasSchema && process.creator_id === user.sub && <SchemaSelector />}
                    {!hasSchema && process.creator_id !== user.sub && <PermissionDenied explanation={t("Only the creator of the process can select an schema")} />}
                    {hasSchema && <Guide setSelectedTreeItem={_setSelectedTreeItem} />}
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="team">
                  <TeamTab />
                </TabPanel>
                <TabPanel value={tab} index="settings">
                  <Card >
                    <SettingsTab />
                  </Card>
                </TabPanel>
              </>
            }
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CoproductionProcessProfile;

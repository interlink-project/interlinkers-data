import {
  Avatar,
  Box, Card, CardHeader, Container, IconButton,
  Tab, Tabs, useMediaQuery,
  useTheme
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { MoreVert } from '@material-ui/icons';
import MainSkeleton from 'components/MainSkeleton';
import PermissionDenied from 'components/PermissionDenied';
import useAuth from 'hooks/useAuth';
import i18next from 'i18next';
import OverviewTab from 'pages/dashboard/coproductionprocesses/Tabs/Overview';
import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { getProcess, setSelectedTreeItem } from 'slices/process';
import useMounted from '../../../hooks/useMounted';
import SchemaSelector from './Tabs/Overview/SchemaSelector';
import Repository from './Tabs/Repository';
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
  mb: '30px',
  minHeight: '87vh'
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

  const processLanguage = i18next.getFixedT(process && process.language);
  const { t } = useTranslation()


  const tabs = [
    { label: processLanguage('Overview'), value: 'overview' },
    { label: processLanguage('Workplan'), value: 'workplan' },
    { label: processLanguage('Guide'), value: 'guide' },
    { label: processLanguage('Team'), value: 'team' },
    { label: processLanguage('Settings'), value: 'settings' },
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
        <Box sx={{ mt: 5 }}>
          <Container maxWidth='xl'>
            {onMobile && <TabsMobile tabs={tabs} tab={tab} process={process} />}
            {loading || !process ? <MainSkeleton /> :
              <>
                <TabPanel value={tab} index="overview">
                  <Card sx={style}>
                    {hasSchema && <OverviewTab setSelectedTreeItem={_setSelectedTreeItem} coproductionprocess={process} />}
                    {!hasSchema && process.creator_id === user.sub && <SchemaSelector />}
                    {!hasSchema && process.creator_id !== user.sub && <PermissionDenied explanation={t("Only the creator of the process can select an schema")} />}
                  </Card>
                </TabPanel>
                {hasSchema && <>
                  <TabPanel value={tab} index="workplan">
                    <Card sx={style}>
                      <Workplan setSelectedTreeItem={_setSelectedTreeItem} />
                    </Card>
                  </TabPanel>
                  <TabPanel value={tab} index="guide">
                    <Card sx={style}>
                      <Repository setSelectedTreeItem={_setSelectedTreeItem} />
                    </Card>
                  </TabPanel>
                </>}
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

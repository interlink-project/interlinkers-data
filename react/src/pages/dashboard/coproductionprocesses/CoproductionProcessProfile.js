import { useMatomo } from '@datapunt/matomo-tracker-react';
import {
  Avatar,
  Box, Card, CardHeader, Container, IconButton, Tab, Tabs, useMediaQuery,
  useTheme
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { MoreVert } from '@material-ui/icons';
import MainSkeleton from 'components/MainSkeleton';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { getProcess, setSelectedTreeItem } from 'slices/process';
import useMounted from '../../../hooks/useMounted';
import Guide from './Tabs/Guide';
import Overview from './Tabs/Overview';
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
  const logoExists = process && process.logotype
  const navigate = useNavigate();

  return process && <Card sx={{ mb: 1 }}>
    <CardHeader
      avatar={
        <Avatar variant="rounded" sx={logoExists ? {} : { bgcolor: red[500] }} aria-label="recipe" src={logoExists && process.logotype_link}>
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
      onChange={(event, value) => navigate(`/dashboard/coproductionprocesses/${process.id}/${value}`)}
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
  const { trackEvent } = useMatomo()

  const { process, loading } = useSelector((state) => state.process);

  const theme = useTheme();
  const showMobileTabs = !useMediaQuery(theme.breakpoints.up('lg'));

  const _setSelectedTreeItem = (item, callback) => {
    trackEvent({
      category: process.id,
      action: 'tree-item-selected',
      name: item.id
    })
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
    { label: t('Guide'), value: 'guide' },
    { label: t('Workplan'), value: 'workplan' },
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
            {showMobileTabs && <TabsMobile tabs={tabs} tab={tab} process={process} />}
            {loading || !process ? <MainSkeleton /> :
              <>
                <TabPanel value={tab} index="overview">
                  <Card sx={style}>
                    <Overview />
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="workplan">
                  <Card sx={{ ...style, mb: 3 }}>
                    <Workplan setSelectedTreeItem={_setSelectedTreeItem} />
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="guide">
                  <Card sx={{ ...style, mb: 3 }}>
                    <Guide setSelectedTreeItem={_setSelectedTreeItem} />
                  </Card>
                </TabPanel>
                <TabPanel value={tab} index="team">
                  <Card sx={{ ...style, mb: 3 }}>
                    <TeamTab />
                  </Card>
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

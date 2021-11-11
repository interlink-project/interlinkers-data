import { useState } from 'react';

import { Helmet } from 'react-helmet-async';
import {
  Box,
  Grid,
  Tab,
  Tabs,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';

const styles = {
  tabs: {
    background: '#fff',
  },
  slide: {
    padding: 15,
    minHeight: 100,
    color: '#fff',
  },
  slide1: {
    backgroundColor: '#FEA900',
  },
  slide2: {
    backgroundColor: '#B3DC4A',
  },
  slide3: {
    backgroundColor: '#6AC0FF',
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}


const GuideTab = ({ coproductionprocess, processTree }) => {
  const [currentTab, setCurrentTab] = useState(processTree ? processTree[0].name : "");
  const [currentObjective, setCurrentObjective] = useState("");
  const [selected, setSelected] = useState([]);
  const [index, setIndex] = useState(0);

  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const handleChange = (event, value) => {
    setIndex(value)
  };

  const handleChangeIndex = index => {
    setIndex(index)
  };

  return (
    <>
      <Helmet>
        <title>Coproduction process workplan</title>
      </Helmet>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {onMobile ? <><Tabs value={index} fullWidth onChange={handleChange} style={styles.tabs}>
          <Tab label="tab n°1" />
          <Tab label="tab n°2" />
          <Tab label="tab n°3" />
        </Tabs>
          <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
            <div style={Object.assign({}, styles.slide, styles.slide1)}>slide n°1</div>
            <div style={Object.assign({}, styles.slide, styles.slide2)}>
              slide n°2
              <Select value={10} autoWidth={false}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
              </Select>
            </div>
            <div style={Object.assign({}, styles.slide, styles.slide3)}>slide n°3</div>
          </SwipeableViews> </> :
          <Grid container>
            <Grid item xl={2}>
              <Tabs
                indicatorColor="secondary"
                onChange={handleTabsChange}
                scrollButtons='auto'
                value={currentTab}
                variant='scrollable'

                orientation="vertical"
                aria-label="Coproduction phases tabs"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >

                {processTree.map((phaseinstantiation) => (
                  <Tab
                    key={phaseinstantiation.id}
                    label={phaseinstantiation.name}
                    value={phaseinstantiation.name}
                  />
                ))}
              </Tabs>
            </Grid>
            <Grid item xl={2}>
              <Tabs
                indicatorColor="secondary"
                onChange={(event, value) => {
                  setCurrentObjective(value);
                }}
                scrollButtons='auto'
                value={currentObjective}
                variant='scrollable'

                orientation="vertical"
                aria-label="Coproduction phases tabs"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >

{processTree.find(el => el.name === currentTab).objectiveinstantiations.map((objectiveinstantiation) => (
                  <Tab
                    key={objectiveinstantiation.id}
                    label={objectiveinstantiation.name}
                    value={objectiveinstantiation.name}
                  />
                ))}
              </Tabs>
            </Grid>
            
          </Grid>
        }

      </Box>

    </>
  );
};

export default GuideTab;

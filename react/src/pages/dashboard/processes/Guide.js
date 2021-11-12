import { useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import {
  Box,
  Grid,
  Tab,
  Tabs,
  Select,
  MenuItem,
  SvgIcon,
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  Collapse,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
  alpha,
  useMediaQuery,
  useTheme,
  IconButton,
  Button,
  Divider
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { assetsApi } from '../../../__fakeApi__';

import {
  TreeItem,
  TreeView,
  treeItemClasses,
} from '@material-ui/lab';
import { styled } from '@material-ui/styles';
import { ExpandMore as ExpandMoreIcon, MoreVert as MoreVertIcon } from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import moment from 'moment';
import Assets from './Assets';
import { cleanUnderScores} from "../../../utils/cleanUnderscores"

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

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CollapseRecommendedInterlinkers = ({ selectedTask }) => {
  const [expanded, setExpanded] = useState(false);
  const [creatingAsset, setCreatingAsset] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const createAsset = async (interlinker) => {
    setCreatingAsset(true)
    const data = await assetsApi.create(
      selectedTask.id,
      interlinker.last_version.id
    );
    console.log(data)
    setCreatingAsset(false)
  }


  return <><Typography variant="overline" gutterBottom>
    Recommended interlinkers
  </Typography>

    <ExpandMore
      expand={expanded}
      onClick={handleExpandClick}
      aria-expanded={expanded}
      aria-label="show more"
    >
      <ExpandMoreIcon />
    </ExpandMore>

    <Collapse in={expanded} timeout="auto" unmountOnExit>

      <List sx={{ width: '100%' }}>
        {selectedTask.recommended_interlinkers.map(interlinker => <ListItem key={interlinker.id} sx={{ bgcolor: 'background.default' }} button onClick={() => createAsset(interlinker)}>
          <ListItemAvatar key={interlinker.id}>
            <Avatar src={interlinker.logotype} />
          </ListItemAvatar>
          <ListItemText primary={cleanUnderScores(interlinker.name)} secondary={`${interlinker.nature === "KN" ? "Knowledge" : "Software"} interlinker`} />
        </ListItem>)}
      </List>

      <Button variant="outlined" fullWidth> Search for other interlinkers </Button>
    </Collapse></>

}

const GuideTab = ({ coproductionprocess, processTree }) => {
  const [currentPhase, setCurrentPhase] = useState(processTree ? processTree[0].name : "");
  const [currentObjective, setCurrentObjective] = useState("");
  const [currentTask, setCurrentTask] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");

  const [index, setIndex] = useState(0);

  const theme = useTheme();
  const onMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  const handleChange = (event, value) => {
    setIndex(value)
  };

  const handleChangeIndex = index => {
    setIndex(index)
  };

  useEffect(() => {
    processTree.forEach(phaseinstantiation => {
      phaseinstantiation.objectiveinstantiations.forEach(objectiveinstantiation => {
        const eo = objectiveinstantiation.taskinstantiations.find(el => el.id === selected)
        if (eo) {
          setSelectedTask(eo)
        }
      })
    });

  }, [selected]);


  function MinusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
      </SvgIcon>
    );
  }

  function PlusSquare(props) {
    return (
      <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
      </SvgIcon>
    );
  }

  function CloseSquare(props) {
    return (
      <SvgIcon
        className="close"
        fontSize="inherit"
        style={{ width: 14, height: 14 }}
        {...props}
      >
        {/* tslint:disable-next-line: max-line-length */}
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
      </SvgIcon>
    );
  }


  const StyledTreeItem = styled((props) => (
    <TreeItem {...props} />
  ))(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
      '& .close': {
        opacity: 0.3,
      },
    },
    [`& .${treeItemClasses.group}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
  }));


  function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} sx={{ color: "primary.contrastText" }} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="primary.contrastText" sx={{ fontWeight: 900 }}>
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

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
            <Grid item xl={2} lg={2} md={2} xs={2}>
              <Tabs
                indicatorColor="secondary"
                onChange={(event, value) => {
                  setCurrentPhase(value);
                }}
                scrollButtons='auto'
                value={currentPhase}
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
            <Grid item xl={4} lg={4} md={4} xs={10}>
              <TreeView
                aria-label="customized"
                defaultExpanded={processTree.map(el => el.id) || []}
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                selected={selected}
                sx={{ flexGrow: 1, overflowY: 'auto', width: "100%" }}
                onNodeSelect={(event, nodeIds) => {
                  setSelected(nodeIds);
                }}
              >

                {processTree.find(el => el.name === currentPhase).objectiveinstantiations.map(objectiveinstantiation =>
                  <StyledTreeItem key={objectiveinstantiation.id} nodeId={objectiveinstantiation.id} label={<p>{cleanUnderScores(objectiveinstantiation.name)}</p>}>
                    {objectiveinstantiation.taskinstantiations.map(taskinstantiation => (
                      <StyledTreeItem key={taskinstantiation.id} nodeId={taskinstantiation.id} label={<p>{cleanUnderScores(taskinstantiation.name)}</p>} />))}
                  </StyledTreeItem>)}
              </TreeView>
            </Grid>
            <Grid item xl={6} lg={6} md={6} xs={12}>
              {selectedTask && <Box sx={{ p: 2 }}>
                <Grid container sx={{ mb: 2, p: 2, backgroundColor: "primary.main" }} justifyContent="space-between" alignItems="center"
                >
                  <Grid item xl={8} lg={9} md={10} xs={10}>
                    <Typography variant="h6" sx={{ color: "primary.contrastText" }}>{cleanUnderScores(selectedTask.name)}</Typography>
                    <Typography paragraph sx={{ color: "primary.contrastText" }}>{selectedTask.description}</Typography>
                  </Grid>
                  <Grid item xl={4} lg={3} md={2} xs={2}>
                    <CircularProgressWithLabel value={40} size={80} sx={{ backgroundColor: "text.secondary", borderRadius: "50%" }} />
                  </Grid>

                </Grid>
                <CollapseRecommendedInterlinkers selectedTask={selectedTask} />
              </Box>}
            </Grid>
            <Grid item xl={12} lg={12} md={12} xs={12}>
              {selectedTask && <Box sx={{ p: 2 }}>
                <Divider />
                <Assets selectedTask={selectedTask} />
              </Box>}
            </Grid>

          </Grid>
        }

      </Box>

    </>
  );
};

export default GuideTab;

import React, { useState, useEffect} from 'react';
import {
  Box,
  Grid,
  Collapse,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Slider,
  FormControl,
  TextField
} from '@material-ui/core';
import { assetsApi } from '__fakeApi__';
import {
  DesktopDateRangePicker
} from '@material-ui/lab';
import { styled } from '@material-ui/styles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { cleanUnderScores } from "utils/cleanUnderscores"
import CircularProgressWithLabel from 'components/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { updateObjectiveInstantiation } from 'slices/process';

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


const CollapseRecommendedInterlinkers = ({ selectedObjective }) => {
  const [expanded, setExpanded] = useState(false);
  const [creatingAsset, setCreatingAsset] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const createAsset = async (interlinker) => {
    setCreatingAsset(true)
    const data = await assetsApi.create(
      selectedObjective.id,
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
        {selectedObjective.recommended_interlinkers.map(interlinker => <ListItem key={interlinker.id} sx={{ bgcolor: 'background.default' }} button onClick={() => createAsset(interlinker)}>
          <ListItemAvatar key={interlinker.id}>
            <Avatar src={interlinker.logotype} />
          </ListItemAvatar>
          <ListItemText primary={cleanUnderScores(interlinker.name)} secondary={`${interlinker.nature === "KN" ? "Knowledge" : "Software"} interlinker`} />
        </ListItem>)}
      </List>

      <Button variant="outlined" fullWidth> Search for other interlinkers </Button>
    </Collapse></>

}

const SelectedObjectiveElement = ({ selectedObjective, onSaved }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    setDateRange([selectedObjective.start_date ? new Date(selectedObjective.start_date) : null, selectedObjective.end_date ? new Date(selectedObjective.end_date) : null])
    setProgress(selectedObjective.progress)
  }, [selectedObjective]);
  
  const dataToSend = async () => {
    const data = { }

    const start_date = dateRange[0] && dateRange[0].toISOString().slice(0, 10)
    const end_date = dateRange[1] && dateRange[1].toISOString().slice(0, 10)
    if(start_date !== selectedObjective.start_date){
      data.start_date = start_date
    }
    if(end_date !== selectedObjective.end_date){
      data.end_date = end_date
    }

    if(progress !== selectedObjective.progress){
      data.progress = progress
    }
    
    dispatch(updateObjectiveInstantiation({id: selectedObjective.id, data}))
    if(onSaved){
      onSaved()
    }
  }

  return <Box sx={{ p: 2 }}>
    <Grid container sx={{ mb: 2, p: 2, backgroundColor: "primary.main" }} justifyContent="space-between" alignItems="center"
    >
      <Grid item xl={8} lg={9} md={10} xs={10}>
        <Typography variant="h6" sx={{ color: "primary.contrastText" }}>{cleanUnderScores(selectedObjective.name)}</Typography>
        <Typography paragraph sx={{ color: "primary.contrastText" }}>{selectedObjective.description}</Typography>
      </Grid>
      <Grid item xl={4} lg={3} md={2} xs={2}>
        <CircularProgressWithLabel value={progress} size={80} />
      </Grid>


    </Grid>
    <DesktopDateRangePicker
      startText="Objective start"
      value={dateRange}
      onChange={(newValue) => {
        setDateRange(newValue);
      }}
      renderInput={(startProps, endProps) => (
        <React.Fragment>
          <TextField {...startProps} />
          <Box sx={{ mx: 2 }}> to </Box>
          <TextField {...endProps} />
        </React.Fragment>
      )}
    />
    <FormControl fullWidth >

      <Slider
        aria-label="Progress"
        value={progress || selectedObjective.progress}
        valueLabelDisplay="auto"
        onChange={({ target: { value } }) => {
          setProgress(value)
        }}
        step={5}
        marks
        min={0}
        max={100}
      />
    </FormControl>
    <Button variant="contained" fullWidth onClick={() => dataToSend()}>Save</Button>
  </Box>
}

export default SelectedObjectiveElement
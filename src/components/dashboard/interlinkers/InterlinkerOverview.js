import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { SafeHTMLElement } from 'utils/safeHTML';

const InterlinkerOverview = (props) => {
  const { interlinker, ...other } = props;
  const { description, tags, name, problemprofiles } = interlinker;


  const isSoftware = interlinker.nature === "softwareinterlinker"
  const isOfficial = !interlinker.creator_id

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>

        <Grid container spacing={3}>

          <Grid item xs={12} md={6} lg={6} xl={6} 
          >
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Name
            </Typography>
            <Typography
              color='textPrimary'
              variant='subtitle2'
            >
              {name}
            </Typography>
          </Grid>
          

          <Grid item xs={12} md={3} lg={3} xl={3} 
          >
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Nature
            </Typography>
            <br></br>
            <Chip label={isSoftware ? "Software" : "Knowledge"} color={isSoftware ? "primary" : "secondary"} size="small" />
          </Grid>
          <Grid item xs={12} md={3} lg={3} xl={3} 
          >
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Creator
            </Typography>
            <br></br>
            <Chip label={isOfficial ? "Official" : "Community"} color={isOfficial ? "success" : "warning"} size="small" />
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6} 
          >
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Description
            </Typography>
            <SafeHTMLElement data={description} />
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6} 
          >
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Tags
            </Typography>
            <Box sx={{ mt: 1 }} md={6} lg={6} >
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant='outlined'
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6} 
          >
            <Typography
              color='textSecondary'
              variant='overline'
            >
              Problem profiles
            </Typography>
            <Box sx={{ mt: 1 }}>
              {problemprofiles.map((problem) => (
                <Chip
                  key={problem.id}
                  label={problem.name}
                  variant='outlined'
                />
              ))}
            </Box>
          </Grid>
          
        </Grid>
      </CardContent>
    </Card>

  );
};

InterlinkerOverview.propTypes = {
  interlinker: PropTypes.object.isRequired,
};

export default InterlinkerOverview;

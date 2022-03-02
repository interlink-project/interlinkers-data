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
  const { description, tags, name, problemprofiles, representations } = interlinker;

  const Element = ({ title, obj, xs = 12, md = 12, lg = 12, xl = 12 }) => <Grid item xs={12} md={md} lg={lg} xl={xl} sx={{ mb: 2 }}
  ><Typography
    color='textSecondary'
    variant='overline'
  >
      {title}
    </Typography>
    {obj}
  </Grid>


  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>

        <Grid
          container
        >
          <Grid
            container
            item
            xs={12}
            md={6}
            lg={6}
            xl={6}
          >
            <Element title="Interlinker Name" obj={<Typography
              color='textPrimary'
              variant='subtitle2'
            >
              {name}
            </Typography>} />

            <Element title="Tags" obj={<Box sx={{ mt: 1 }} md={6} lg={6} >
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  variant='outlined'
                />
              ))}
            </Box>} />

            <Element title="Problem profiles" md={6} lg={6} obj={<Box sx={{ mt: 1 }}>
              {problemprofiles.map((problem) => (
                <Chip
                  key={problem.id}
                  label={problem.name}
                  variant='outlined'
                />
              ))}
            </Box>} />

            <Element title="Description" obj={<SafeHTMLElement data={description} />} />

          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            xl={6}
          >
            <SafeHTMLElement data={interlinker.instructions} />
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

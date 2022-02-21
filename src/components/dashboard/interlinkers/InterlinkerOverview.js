import PropTypes from 'prop-types';
import Markdown from 'react-markdown/with-html';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import SwipeableTextMobileStepper from './browse/Carousel';
import { SafeHTMLElement } from 'utils/safeHTML';

const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& p': {
    marginBottom: theme.spacing(2),
  },
}));

const InterlinkerOverview = (props) => {
  const { interlinker, ...other } = props;
  const { description, tags, name, problemprofiles, representations } = interlinker;

  const Element = ({ title, obj, xs = 12, md = 12, lg = 12, xl = 12 }) => <Grid item xs={12} md={md} lg={lg} xl={xl}     sx={{ mb: 2 }}
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
            lg={8}
            xl={8}
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
            lg={4}
            xl={4}
          >
            <Box sx={{ bottom: 0 }}>
              <SwipeableTextMobileStepper images={interlinker.images} />
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
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

const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& p': {
    marginBottom: theme.spacing(2),
  },
}));

const InterlinkerOverview = (props) => {
  const { interlinker, ...other } = props;
  const { description, tags, name } = interlinker;

  return (


    <Card {...other} sx={{height: "100%"}}>
      <Grid
        container
        spacing={3}
        {...other}
      >
        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          xl={6}
        >
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <Typography
                  color='textSecondary'
                  variant='overline'
                >
                  Interlinker Name
                </Typography>
                <Typography
                  color='textPrimary'
                  variant='subtitle2'
                >
                  {name}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography
                    color='textSecondary'
                    variant='overline'
                  >
                    Tags
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        variant='outlined'
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Typography
                color='textSecondary'
                sx={{ mb: 2 }}
                variant='overline'
              >
                Description
              </Typography>
              <MarkdownWrapper>
                <Markdown source={description} />
              </MarkdownWrapper>
            </Box>

          </CardContent>
        </Grid>
        <Grid
          item
          md={6}
          lg={6}
          xl={6}
          xs={12}
        >
          <Box sx={{ bottom: 0 }}>
            <SwipeableTextMobileStepper images={interlinker.images} />
          </Box>
        </Grid>
      </Grid>
    </Card>

  );
};

InterlinkerOverview.propTypes = {
  interlinker: PropTypes.object.isRequired,
};

export default InterlinkerOverview;

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
import InterlinkerMetadata from './InterlinkerMetadata';
import { experimentalStyled } from '@material-ui/core/styles';

const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& p': {
    marginBottom: theme.spacing(2),
  },
}));

const InterlinkerOverview = (props) => {
  const { interlinker, ...other } = props;
  const { description, keywords, title } = interlinker;

  return (
    <Grid
      container
      spacing={3}
      {...other}
    >
      <Grid
        item
        md={3}
        lg={3}
        xl={2}
        xs={12}
        direction='column'
        alignItems='center'
        justify='center'
      >
        <InterlinkerMetadata
          logo={interlinker.image}
          title={interlinker.title}
          budget={interlinker.budget}
          currency={interlinker.currency}
          endDate={interlinker.endDate}
          updatedAt={interlinker.updatedAt}
        />
      </Grid>
      <Grid
        item
        md={9}
        lg={9}
        xl={10}
        xs={12}
      >
        <Card {...other}>
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
                  {title}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography
                    color='textSecondary'
                    variant='overline'
                  >
                    Keywords
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {keywords.map((tag) => (
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
        </Card>
      </Grid>
    </Grid>
  );
};

InterlinkerOverview.propTypes = {
  interlinker: PropTypes.object.isRequired,
};

export default InterlinkerOverview;

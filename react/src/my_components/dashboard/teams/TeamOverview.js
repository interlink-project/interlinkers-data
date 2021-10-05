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
import TeamMetadata from './TeamMetadata';
import { experimentalStyled } from '@material-ui/core/styles';

const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& p': {
    marginBottom: theme.spacing(2),
  },
}));

const TeamOverview = (props) => {
  const { team, ...other } = props;
  const { description, keywords, title } = team;

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
        <TeamMetadata
          logo={team.image}
          title={team.title}
          budget={team.budget}
          currency={team.currency}
          endDate={team.endDate}
          updatedAt={team.updatedAt}
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
                  Team Name
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

TeamOverview.propTypes = {
  team: PropTypes.object.isRequired,
};

export default TeamOverview;

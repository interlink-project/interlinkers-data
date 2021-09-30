import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Rating,
  Button,
  Stack,
  IconButton,
  Grid,
  CardActions,
  Typography,
  Link,
  Box,
} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const InterlinkerMetadata = ({
  logo,
  title,
  budget,
  currency,
  endDate,
  updatedAt,
}) => (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            p: 1,
            border: (theme) => `1px dashed ${theme.palette.divider}`,
            borderRadius: '5%',
          }}
        >
          <Avatar
            src={logo}
            sx={{
              height: 100,
              width: 100,
            }}
            variant='rounded'
          />
        </Box>
        <Typography
          color='textPrimary'
          sx={{ mt: 1 }}
          variant='subtitle2'
        >
          {title}
        </Typography>

        <Rating
          readOnly
          value={5}
          sx={{ mt: 1 }}
        />
        <Stack
          direction='row'
          sx={{ mt: 2 }}
        >
          <IconButton
            color='secondary'
            aria-label='add an alarm'
          >
            <FavoriteBorderIcon />
          </IconButton>

          <IconButton aria-label='delete'>
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label='delete'
            color='primary'
          >
            <ShareIcon />
          </IconButton>
        </Stack>
      </Box>
    </CardContent>
    <CardActions sx={{ mt: 0 }}>
      <Button
        color='success'
        fullWidth
        variant='contained'
      >
        Clone
      </Button>
    </CardActions>
  </Card>
);

InterlinkerMetadata.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  budget: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  endDate: PropTypes.number.isRequired,
  updatedAt: PropTypes.number.isRequired,
};

export default InterlinkerMetadata;

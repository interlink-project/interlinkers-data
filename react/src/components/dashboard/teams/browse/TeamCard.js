import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { truncate } from 'lodash';

import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  Link,
  Rating,
  Tooltip,
  Typography,
} from '@material-ui/core';
import UsersIcon from '../../../../icons/Users';
import { getImageUrl } from '../../../../axios';

const TeamCard = (props) => {
  const { team, ...other } = props;
  
  if(!team){
    return null
  }
  return (
    <Card {...other}>
      <Box sx={{ p: 3 }}>
        {/*
        <CardMedia
          image={team.image}
          sx={{
            backgroundColor: 'background.default',
            height: 200
          }}
        /> */}
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mt: 2,
          }}
        >
          <Avatar
            alt='Team'
            src={getImageUrl(team.logotype)}
          >
            {team.name}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Link
              color='textPrimary'
              component={RouterLink}
              to='/dashboard/teams/123'
              variant='h6'
            >
              {team.name}
            </Link>
            <Typography
              color='textSecondary'
              variant='body2'
            >
              by
              {' '}
              <Link
                color='textPrimary'
                component={RouterLink}
                to='#'
                variant='subtitle2'
              >
                {team.name}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          pb: 2,
          px: 3,
        }}
      >
        <Typography
          color='textSecondary'
          variant='body2'
        >
          {}
          {truncate(team.description, {
            length: 200,
            separator: ' ',
          })}
        </Typography>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Grid
          alignItems='center'
          container
          justifyContent='space-between'
          spacing={3}
        >
          <Grid item>
            <Typography
              color='textSecondary'
              variant='body2'
            >
              Status
            </Typography>
            <Typography
              color='textPrimary'
              variant='subtitle2'
            >
              ss
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color='textSecondary'
              variant='body2'
            >
              Location
            </Typography>
            <Typography
              color='textPrimary'
              variant='subtitle2'
            >
              ss
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color='textSecondary'
              variant='body2'
            >
              Type
            </Typography>
            <Typography
              color='textPrimary'
              variant='subtitle2'
            >
              ss
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          pl: 2,
          pr: 3,
          py: 2,
        }}
      >
        
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            ml: 2,
          }}
        >
          <UsersIcon fontSize='small' />
          <Typography
            color='textSecondary'
            sx={{ ml: 1 }}
            variant='subtitle2'
          >
            3
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Rating
          readOnly
          size='small'
          value={2}
        />
      </Box>
    </Card>
  );
};

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
};

export default TeamCard;

import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { truncate } from 'lodash';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Divider,
  Grid,
  IconButton,
  Link,
  Rating,
  Tooltip,
  Typography,
} from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import UsersIcon from '../../../../icons/Users';
import { getImageUrl } from 'axiosInstance';
import { useSelector } from 'react-redux';
import SwipeableTextMobileStepper from './Carousel';

const InterlinkerCard = (props) => {
  const { status } = useSelector((state) => state.catalogue);
  const { interlinker, ...other } = props;
  const [isLiked, setIsLiked] = useState(interlinker.isLiked);
  const [likes, setLikes] = useState(interlinker.likes || 0);
  const isOn = status[interlinker.backend] && status[interlinker.backend].status === "on"
  const isSoftware = interlinker.nature === "SW"
  const sameHeightCards = {
    minHeight: "200px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
  }
  const handleLike = () => {
    setIsLiked(true);
    setLikes((prevLikes) => prevLikes + 1);
  };

  const handleUnlike = () => {
    setIsLiked(false);
    setLikes((prevLikes) => prevLikes - 1);
  };
  //     <CardActionArea component={RouterLink} to="/">

  return (

    <Card {...other} style={sameHeightCards}>
      <Box sx={{ p: 3 }}>


        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mt: 2,
          }}
        >
          <Avatar
            alt='Team'
            src={getImageUrl("catalogue", interlinker.logotype)}
            variant='square'
          >
            {interlinker.title}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Link
              color='textPrimary'
              component={RouterLink}
              to='/dashboard/interlinkers/123'
              variant='h6'
              title={interlinker.name}
            >
              {truncate(interlinker.name, {
                length: 100,
                separator: ' ',
              })}

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
                title={"teamname"}
              >
                team name
              </Link>
              {' '}
              | Last update:
              {' '}
              {formatDistanceToNowStrict(new Date(interlinker.updated_at || interlinker.created_at))}
              {' '}
              ago
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          pb: 1,
          px: 3,
        }}
      >
        <Typography
          color='textSecondary'
          variant='body2'
        >
          { }
          {truncate(interlinker.description, {
            length: 200,
            separator: ' ',
          })}
        </Typography>
      </Box>

      <Box
        sx={{
          px: 3,
          pb: 1,
        }}
      >
        <Grid
          alignItems='center'
          sx={{ textAlign: "center" }}
          container
          justifyContent='space-between'
          spacing={3}
        >
          <Grid item>
            <Typography
              color='textPrimary'
              variant='subtitle2'
              sx={{ mb: 1 }}
            >
              Status
            </Typography>
            <Typography
              color='textPrimary'
              variant='subtitle2'
            >
              <Chip label={isOn ? "on" : "off"} color={isOn ? "success" : "warning"} size="small" />
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color='textPrimary'
              variant='subtitle2'
              sx={{ mb: 1 }}
            >
              Nature
            </Typography>
            <Typography
              color='textPrimary'
              variant='subtitle2'
            >
              <Chip label={isSoftware ? "Software" : "Knowledge"} color={isSoftware ? "primary" : "secondary"} size="small" />

            </Typography>
          </Grid>
          <Grid item>
            <Typography
              color='textPrimary'
              variant='subtitle2'
              sx={{ mb: 1 }}
            >
              Rating
            </Typography>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <Rating
                readOnly
                size='small'
                value={1}
              />
              <Typography
                color='textPrimary'
                sx={{ ml: 1 }}
              >
                (0)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          pb: 2,
          px: 3,
        }}
      >
        <Typography
          color='textPrimary'
          variant='subtitle2'
          sx={{ mb: 1 }}
        >
          Keywords
        </Typography>
        {interlinker.keywords && interlinker.keywords.split(";").map(
          el => <Chip label={el} key={el} size="small" variant="outlined" sx={{ mr: 1 }} />
        )}
      </Box>
      
      <Box
        sx={{
          alignItems: 'center',
          textAlign: 'center',
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
          }}
        >
          {isLiked ? (
            <Tooltip title='Unlike'>
              <IconButton
                onClick={handleUnlike}
                sx={{ color: red['600'] }}
              >
                <FavoriteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title='Like'>
              <IconButton onClick={handleLike}>
                <FavoriteBorderIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          <Typography
            color='textSecondary'
            variant='subtitle2'
          >
            {likes}
          </Typography>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            ml: 2,
          }}
        >
          <Button>Clone</Button>

        </Box>
        <Box sx={{ flexGrow: 1 }} />
        

      </Box>
      <Box sx={{bottom: 0}}>
      <SwipeableTextMobileStepper />

      </Box>
    </Card>
  );
};

InterlinkerCard.propTypes = {
  interlinker: PropTypes.object.isRequired,
};

export default InterlinkerCard;

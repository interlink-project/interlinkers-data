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
  Popover,
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
  const { interlinker, mode, ...other } = props;
  const [isLiked, setIsLiked] = useState(interlinker.isLiked);
  const [likes, setLikes] = useState(interlinker.likes || 0);
  const [hovered, setHovered] = useState(false);
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

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const GridMode = () => <><Box sx={{ p: 3 }}>

    <Box

      sx={{
        alignItems: 'center',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'space-between',
        mt: 2,
      }}
    >
      <Avatar
        alt='Logotype'
        src={getImageUrl("catalogue", interlinker.logotype)}
        variant='square'
      >
        {interlinker.title}
      </Avatar>
      <Box sx={{ ml: 2 }}>
        <Link
          color='textPrimary'
          component={RouterLink}
          to={`/dashboard/interlinkers/${interlinker.id}`}
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
        </Typography>
        <Typography
          color='textSecondary'
          variant='body2'
        >
          Last update:
          {' '}
          {formatDistanceToNowStrict(new Date(interlinker.updated_at || interlinker.created_at))}
          {' '}
          ago
        </Typography>

      </Box>
      <Box
        sx={{
          alignItems: 'right',
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
      </Box>
    </Box>
    
  </Box>
  {hovered ? <Box sx={{ bottom: 0 }}>
      <SwipeableTextMobileStepper images={interlinker.images} height="300px" />
    </Box> : <><Box
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
    </Box></>}
    

    

  </>

  return (
      <Card {...other} style={sameHeightCards} aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        {mode === "grid" && <GridMode />}

      </Card>
  );
};

InterlinkerCard.propTypes = {
  interlinker: PropTypes.object.isRequired,
};

export default InterlinkerCard;

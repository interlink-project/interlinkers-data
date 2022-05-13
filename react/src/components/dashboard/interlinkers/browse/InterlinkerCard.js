import {
  Avatar,
  Box, Card, Chip, Grid,
  IconButton,
  Link,
  Rating,
  Tooltip,
  Typography
} from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { NatureChip } from 'components/dashboard/assets/Icons';
import { formatDistanceToNowStrict } from 'date-fns';
import { truncate } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { HTMLtoText } from 'utils/safeHTML';
import SwipeableTextMobileStepper from 'components/SwipeableTextMobileStepper';


const InterlinkerCard = ({ interlinker, mode, onInterlinkerClick }) => {
  const [isLiked, setIsLiked] = useState(interlinker.isLiked);
  const [likes, setLikes] = useState(interlinker.likes || 0);
  const { t } = useTranslation()

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

  const linkProps = onInterlinkerClick ? {
    onClick: () => onInterlinkerClick(interlinker),
  } : {
    component: RouterLink,
    onClick: onInterlinkerClick,
    to: `/dashboard/interlinkers/${interlinker.id}`
  }
  const GridMode = () => <>
    <Box sx={{ p: 3, pb: 1 }}>

      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        {interlinker.logotype_link ? <Avatar
          alt={t("Logotype")}
          src={interlinker.logotype_link}
          variant='square'
        >
          {interlinker.title}
        </Avatar> : <div></div>}
        <Box sx={{ ml: 2 }}>
          <Link
            color='textPrimary'
            {...linkProps}
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
            {t("by")}
            {' '}
            <Link
              color='textPrimary'
              component={RouterLink}
              to='#'
              variant='subtitle2'
              title={"teamname"}
            >
              {t("Interlink platform")}
            </Link>
          </Typography>
          <Typography
            color='textSecondary'
            variant='body2'
          >
            {t('Last update')}:
            {' '}
            {t('time-ago', {
              when: formatDistanceToNowStrict(new Date(interlinker.updated_at || interlinker.created_at))
            })}
          </Typography>

        </Box>
        <Box
          sx={{
            alignItems: 'right',
            display: 'flex',
          }}
        >
          {/* isLiked ? (
            <Tooltip title={t('Unlike')}>
              <IconButton
                onClick={handleUnlike}
                sx={{ color: red['600'] }}
              >
                <FavoriteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={t('Like')}>
              <IconButton onClick={handleLike}>
                <FavoriteBorderIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          ) */}
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
        {HTMLtoText(truncate(interlinker.description, {
          length: 200,
          separator: ' ',
        }))}
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
        {/*<Grid item>
          <Typography
            color='textPrimary'
            variant='subtitle2'
            sx={{ mb: 1 }}
          >
            Creator
          </Typography>
          <Typography
            color='textPrimary'
            variant='subtitle2'
          >
            <OfficialityChip />
          </Typography>
    </Grid>*/}
        <Grid item>
          <Typography
            color='textPrimary'
            variant='subtitle2'
            sx={{ mb: 1 }}
          >
            {t("Nature")}
          </Typography>
          <Typography
            color='textPrimary'
            variant='subtitle2'
          >
            <NatureChip interlinker={interlinker} />
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            color='textPrimary'
            variant='subtitle2'
            sx={{ mb: 1 }}
          >
            {t("Rating")}
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
              value={interlinker.rating || 0}
            />
            <Typography
              color='textPrimary'
              sx={{ ml: 1 }}
            >
              ({interlinker.ratings_count})
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
      {/*<Typography
        color='textPrimary'
        variant='subtitle2'
        sx={{ mb: 1, textAlign: "center" }}
      >
        {t("Keywords")}
      </Typography>
      {interlinker.tags && interlinker.tags.map(
        el => <Chip label={el} key={el} size="small" variant="outlined" sx={{ mr: 1 }} />
      )}*/}
    </Box>
    <Box sx={{ bottom: 0 }}>
      <SwipeableTextMobileStepper images={interlinker.snapshots_links} height="300px" />
    </Box>
  </>

  return (
    <Card style={sameHeightCards}
      aria-haspopup="true"
    // onMouseEnter={() => setHovered(true)}
    // onMouseLeave={() => setHovered(false)}
    >
      {mode === "grid" && <GridMode />}

    </Card>
  );
};

InterlinkerCard.propTypes = {
  interlinker: PropTypes.object.isRequired,
};

export default InterlinkerCard;
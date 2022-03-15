import { Avatar, Box, Card, CardHeader, IconButton, Link, Rating, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import moment from "moment";
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const InterlinkerReviewCard = (props) => {
  const { authorAvatar, title, authorName, comment, createdAt, value } = props;
  const [editMode, _setEditMode] = useState(false);

  return (
    <Card>
      <IconButton onClick={() => _setEditMode(true)} sx={{
              position: "relative",
              right: "10px",
              top: "10px",
              float: "right"
            }}>
              <Edit />
            </IconButton>
      <CardHeader
        avatar={(
          <Avatar src={authorAvatar} />
        )}
        disableTypography
        subheader={
          <Typography
            color='textSecondary'
            variant='body2'
            sx={{ ml: 1 }}
          >
            {moment(createdAt).fromNow()}
          </Typography>}
        title={
          <><Typography
            color='textPrimary'
            sx={{ ml: 1 }}
            variant='subtitle2'
          >
            {authorName}
          </Typography>
            
          </>}
      />
      <Box
        sx={{
          pb: 2,
          px: 3
        }}
      >
        <Rating
          readOnly
          value={value}
        />
        <Typography
          color='textSecondary'
          variant='h6'
        >
          {title}
        </Typography>
        <Typography
          color='textSecondary'
          variant='body1'
        >
          {comment}
        </Typography>
      </Box>
    </Card>
  );
};

InterlinkerReviewCard.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

export default InterlinkerReviewCard;

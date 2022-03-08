import PropTypes from 'prop-types';
import { Box, Card, CardContent, Grid, Paper, Rating, TextField, Typography } from '@material-ui/core';
import InterlinkerReviewCard from './InterlinkerReviewCard';
import { useEffect, useState } from 'react';
import axiosInstance from 'axiosInstance';
import { ratingsApi } from '__fakeApi__/catalogue/ratingsApi';

/* [
            {
              id: '5f0366cd843161f193ebadd4',
              author: {
                avatar: '/static/mock-images/avatars/avatar-marcus_finn.png',
                name: 'Marcus Finn',
              },
              comment: 'Great information.',
              createdAt: subHours(now, 2).getTime(),
              value: 5,
            },
            {
              id: 'to33twsyjphcfj55y3t07261',
              author: {
                avatar: '/static/mock-images/avatars/avatar-miron_vitold.png',
                name: 'Miron Vitold',
              },
              comment:
                "Not the best for this kind of task.",
              createdAt: subHours(now, 2).getTime(),
              value: 2,
            },
          ]
          */
const InterlinkerRatings = ({ interlinker }) => {
  const [loading, setLoading] = useState(true)
  const [ratings, setRatings] = useState([])

  useEffect(() => {
    ratingsApi.getMulti(interlinker.id).then((res) => { 
      setLoading(false); 
      setRatings(res) 
    })
  }, [])

  const rating = ratings.reduce((acc, rating) => acc + rating.value, 0) / ratings.length;

  return (
    <div>
      <Card>
        <CardContent>
          <Grid
            alignItems='center'
            container
            spacing={3}
          >
            <Grid item>
              <Typography
                color='textPrimary'
                variant='subtitle2'
              >
                Overall Ratings
              </Typography>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex'
                }}
              >
                <Rating value={rating} readOnly />
                <Typography
                  color='textPrimary'
                  sx={{ ml: 2 }}
                  variant='subtitle2'
                >
                  {rating ? rating.toFixed(1) : 0}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Typography
                color='textSecondary'
                variant='body2'
              >
                {ratings.length}
                {' '}
                ratings in total
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {ratings.map((rating) => (
        <Box
          key={rating.id}
          sx={{ mt: 2 }}
        >
          <InterlinkerReviewCard
            authorAvatar={rating.author.avatar}
            authorName={rating.author.name}
            comment={rating.comment}
            createdAt={rating.createdAt}
            value={rating.value}
          />
        </Box>
      ))}
      <Paper sx={{ mt: 2, p: 3 }}>
        <TextField
          fullWidth
          label="Write a comment here..."
          multiline
          rows={2}
          variant="standard"
        />
      </Paper>

    </div>
  );
};

InterlinkerRatings.propTypes = {
  ratings: PropTypes.array
};

export default InterlinkerRatings;

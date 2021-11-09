import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import TeamReviewsSummary from './TeamReviewsSummary';
import TeamReviewCard from './TeamReviewCard';

const TeamReviews = (props) => {
  const { reviews, ...other } = props;

  const rating = reviews.reduce((acc, review) => acc + review.value, 0) / reviews.length;

  return (
    <div {...other}>
      <TeamReviewsSummary
        rating={rating}
        reviewsCount={reviews.length}
      />
      {reviews.map((review) => (
        <Box
          key={review.id}
          sx={{ mt: 2 }}
        >
          <TeamReviewCard
            authorAvatar={review.author.avatar}
            authorName={review.author.name}
            comment={review.comment}
            createdAt={review.createdAt}
            value={review.value}
          />
        </Box>
      ))}
    </div>
  );
};

TeamReviews.propTypes = {
  reviews: PropTypes.array
};

export default TeamReviews;

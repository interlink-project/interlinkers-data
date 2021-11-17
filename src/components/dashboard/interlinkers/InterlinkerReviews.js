import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import InterlinkerReviewsSummary from './InterlinkerReviewsSummary';
import InterlinkerReviewCard from './InterlinkerReviewCard';

const InterlinkerReviews = (props) => {
  const { reviews, ...other } = props;

  const rating = reviews.reduce((acc, review) => acc + review.value, 0) / reviews.length;

  return (
    <div {...other}>
      <InterlinkerReviewsSummary
        rating={rating}
        reviewsCount={reviews.length}
      />
      {reviews.map((review) => (
        <Box
          key={review.id}
          sx={{ mt: 2 }}
        >
          <InterlinkerReviewCard
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

InterlinkerReviews.propTypes = {
  reviews: PropTypes.array
};

export default InterlinkerReviews;

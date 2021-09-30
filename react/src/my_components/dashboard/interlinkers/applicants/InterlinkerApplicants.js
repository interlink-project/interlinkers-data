import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import InterlinkerApplicantCard from './InterlinkerApplicantCard';

const InterlinkerApplicants = (props) => {
  const { applicants, ...other } = props;

  return (
    <Grid
      container
      spacing={3}
      {...other}
    >
      {applicants.map((applicant) => (
        <Grid
          item
          key={applicant.id}
          lg={3}
          xs={12}
        >
          <InterlinkerApplicantCard
            avatar={applicant.avatar}
            cover={applicant.cover}
            name={applicant.name}
            skills={applicant.skills}
          />
        </Grid>
      ))}
    </Grid>
  );
};

InterlinkerApplicants.propTypes = {
  applicants: PropTypes.array.isRequired
};

export default InterlinkerApplicants;

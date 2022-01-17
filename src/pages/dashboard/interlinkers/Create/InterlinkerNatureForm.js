import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card, FormHelperText, Paper, Radio, Typography } from '@material-ui/core';

const natureOptions = [
  {
    description: 'What is it?',
    title: 'Knowledge interlinker',
    value: 'knowledgeinterlinker'
  },
  {
    description: 'What is it?',
    title: 'Software interlinker',
    value: 'softwareinterlinker'
  },
];

const InterlinkerNatureForm = (props) => {
  const { onBack, onNext, nature, ...other } = props;
  const [selectedNature, setSelectedNature] = useState(nature || natureOptions[0].value);
  const [error, setError] = useState(null);

  const handleChange = (newNature) => {
    setSelectedNature(newNature);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (onNext) {
        onNext(selectedNature);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      {...other}
    >

      <Typography
        color='textPrimary'
        variant='h6'
      >
        Select interlinker nature
      </Typography>
      <Typography
        color='textSecondary'
        variant='body1'
      >
        The interlinkers are categorized into two natures; knowledge and software interlinkers. Please, select the nature that fits with the interlinker you want to add to the catalogue:
      </Typography>
      <Box sx={{ mt: 2 }}>
        {natureOptions.map((natureOption) => (
          <Paper
            key={natureOption.value}
            sx={{
              alignItems: 'flex-start',
              display: 'flex',
              mb: 2,
              padding: 2
            }}
            variant='outlined'
          >
            <Radio
              checked={selectedNature === natureOption.value}
              color='primary'
              onClick={() => handleChange(natureOption.value)}
            />
            <Box sx={{ ml: 2 }}>
              <Typography
                color='textPrimary'
                variant='subtitle2'
              >
                {natureOption.title}
              </Typography>
              <Typography
                color='textSecondary'
                variant='body2'
              >
                {natureOption.description}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
      {error && (
        <Box sx={{ mt: 2 }}>
          <FormHelperText error>
            {error}
          </FormHelperText>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          mt: 6
        }}
      >
        {onBack && (
          <Button
            color='primary'
            onClick={onBack}
            size='large'
            variant='text'
          >
            Previous
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color='primary'
          type='submit'
          variant='contained'
        >
          Next
        </Button>
      </Box>
    </form>
  );
};

InterlinkerNatureForm.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};

export default InterlinkerNatureForm;

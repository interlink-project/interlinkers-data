import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Stepper,
  Step,
  StepLabel
} from '@material-ui/core';
import useSettings from '../../../hooks/useSettings';
import gtm from '../../../lib/gtm';
import InterlinkerDescriptionForm from './Create/InterlinkerDescriptionForm';
import InterlinkerDetailsForm from './Create/InterlinkerDetailsForm';
import InterlinkerNatureForm from './Create/InterlinkerNatureForm';

const steps = [
  'Artefact information',
  'Interlinker nature specific information',
];

const InterlinkerCreate = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const [activeStep, setActiveStep] = useState(0);
  const [nature, setNature] = useState(false);

  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    setCompleted(true);
  };

  const handleNatureSelectionNext = (n) => {
    setNature(n)
    handleNext()
  };

  return (
    <>
      <Helmet>
        <title>Dashboard: Interlinker Create</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid
            alignItems='center'
            container
            justifyContent='space-between'
            spacing={3}
          >
            <Grid item>
              <Typography
                color='textPrimary'
                variant='h5'
              >
                Create Wizard &amp; Process
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <div>
              <Card sx={{ p: 3 }}>
                <Stepper activeStep={1} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {!completed ? (
                  <>
                    {activeStep === 0 && (
                      <InterlinkerDetailsForm
                        onNext={handleNext}
                      />
                    )}
                    {activeStep === 1 && (
                      <InterlinkerNatureForm onBack={handleBack} onNext={handleNatureSelectionNext} nature={nature} />
                    )}
                    {activeStep === 2 && (
                      <InterlinkerDescriptionForm
                        onBack={handleBack}
                        onComplete={handleComplete}
                      />
                    )}
                  </>
                ) : (
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          maxWidth: 450,
                          mx: 'auto',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <Avatar
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'primary.contrastText',
                            }}
                          >
                            <StarIcon fontSize='small' />
                          </Avatar>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            align='center'
                            color='textPrimary'
                            variant='h3'
                          >
                            You are all done!
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            align='center'
                            color='textSecondary'
                            variant='subtitle1'
                          >
                            Donec ut augue sed nisi ullamcorper posuere sit amet
                            eu mauris. Ut eget mauris scelerisque.
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 2,
                          }}
                        >
                          <Button
                            color='primary'
                            component={RouterLink}
                            to='/dashboard/interlinkers/1'
                            variant='contained'
                          >
                            View interlinker
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Card>

            </div>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default InterlinkerCreate;

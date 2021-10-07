import { useEffect, useState, useCallback } from 'react';
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
} from '@material-ui/core';
import useSettings from '../../../hooks/useSettings';
import gtm from '../../../lib/gtm';
import CoproductionProcessArtefactForm from './CoproductionProcessArtefactForm';
import CoproductionProcessDetailsForm from './CoproductionProcessDetailsForm';

const CoproductionProcessCreate = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const [details, setDetails] = useState({
    name: 'Demo',
    description: '<p>demo deasdfasdfasdfsc </p>',
    artefact_type: 'interlinker',
    keywords: ['demo'],
    problemdomain_id: 'ffff',
    problemdomain: '',
    submit: null,
  });
  const [artefact, setArtefact] = useState({
    target_stakeholder_groups: [],
    nature: '',
    administrative_scope: '',
    specific_app_domain: [],
    constraints: [],
    regulations: [],
    software_type: '',
    software_implementation_facts: '',
    software_customization_facts: '',
    software_integration_facts: '',
    knowledge_type: '',
    knowledge_format: '',
    // if public service
    language: '',
    processing_time: '',
    location: '',
    status: '',
    public_organization: '',
    output: '',
    cost: '',
    submit: null,
  });
  const onDetailsSubmit = useCallback((values) => {
    setDetails(values);
  }, []);
  const onArtefactSubmit = useCallback((values) => {
    setArtefact(values);
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    setCompleted(true);
  };

  console.log(details, artefact)

  return (
    <>
      <Helmet>
        <title>Dashboard: Coproduction process creation</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth='xl'>
          <Grid
            alignItems='center'
            container
            justifyContent='space-between'
            spacing={3}
          >
            <Grid item>
              <Typography color='textPrimary' variant='h5'>
                Coproduction process creation wizard
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <div>
              {!completed ? (
                <>
                  {activeStep === 0 && (
                    <CoproductionProcessDetailsForm
                      onNext={handleNext}
                      details={details}
                      setDetails={onDetailsSubmit}
                    />
                  )}
                  {activeStep === 1 && (
                    <CoproductionProcessArtefactForm
                      onBack={handleBack}
                      artefact={artefact}
                      setArtefact={onArtefactSubmit}
                      artefact_type={details.artefact_type}
                      onNext={handleComplete}
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
                          to='/dashboard/coproductionprocesses/1'
                          variant='contained'
                        >
                          View coproductionprocess
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </div>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CoproductionProcessCreate;

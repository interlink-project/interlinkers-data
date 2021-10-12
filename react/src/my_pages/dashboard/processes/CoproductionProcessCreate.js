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
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core';
import useSettings from '../../../hooks/useSettings';
import gtm from '../../../lib/gtm';
import CoproductionProcessArtefactForm from './CoproductionProcessArtefactForm';
import CoproductionProcessDetailsForm from './CoproductionProcessDetailsForm';
import { problemdomainsApi } from '../../../__fakeApi__/problemDomains';
import { teamsApi } from '../../../__fakeApi__/teamsApi';
import useMounted from '../../../hooks/useMounted';

const CoproductionProcessCreate = () => {
  const { settings } = useSettings();
  const mounted = useMounted();
  const [problemDomains, setProblemDomains] = useState(null);
  const [teams, setTeams] = useState(null);

  const getData = useCallback(async () => {
    try {
      const data = await problemdomainsApi.getProblemDomains();
      const data2 = await teamsApi.getTeams();

      if (mounted.current) {
        setProblemDomains(data);
        setTeams(data2);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const [details, setDetails] = useState({
    name: 'Demo',
    description: '<p>demo deasdfasdfasdfsc </p>',
    artefact_type: 'interlinker',
    team_id: null,
    keywords: ['demo'],
    problemdomains: [],
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
            <Card sx={{ p: 3 }}>
              <Box sx={{ mt: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  <Step key={0}>
                    <StepLabel>General information</StepLabel>
                  </Step>
                  <Step key={1}>
                    <StepLabel>Artefact details</StepLabel>
                  </Step>
                </Stepper>
              </Box>
              {!completed ? (
                <>
                  {activeStep === 0 && (
                    <CoproductionProcessDetailsForm
                      onNext={handleNext}
                      details={details}
                      setDetails={onDetailsSubmit}
                      problemDomains={problemDomains}
                      teams={teams}
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
                        Donec ut augue sed nisi ullamcorper posuere sit amet eu
                        mauris. Ut eget mauris scelerisque.
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
              )}
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CoproductionProcessCreate;

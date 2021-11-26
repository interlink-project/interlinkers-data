import { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
} from '@material-ui/core';
import CoproductionProcessDetailsForm from './CoproductionProcessDetailsForm';
import { teamsApi } from '../../../__fakeApi__/teamsApi';
import useMounted from '../../../hooks/useMounted';

const CoproductionProcessCreate = () => {
  const mounted = useMounted();
  const [teams, setTeams] = useState(null);

  const getData = useCallback(async () => {
    try {
      const data2 = await teamsApi.getMulti();

      if (mounted.current) {
        setTeams(data2);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getData();
  }, [getData]);

  const [details, setDetails] = useState({
    name: 'Demo',
    description: '<p></p>',
    artefact_type: 'interlinker',
    team_id: null,
    keywords: ['demo'],
    submit: null,
  });

  const onDetailsSubmit = useCallback((values) => {
    setDetails(values);
  }, []);


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
              <CoproductionProcessDetailsForm
                details={details}
                setDetails={onDetailsSubmit}
                teams={teams}
              />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CoproductionProcessCreate;

import {
  Box,
  Container
} from '@material-ui/core';
import useMounted from 'hooks/useMounted';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { interlinkersApi } from '__api__';
import InterlinkerDetails from './InterlinkerDetails';
import InterlinkerHeader from './InterlinkerHeader';

const InterlinkerProfile = () => {
  let { interlinkerId } = useParams();
  const [interlinker, setInterlinker] = useState(null)
  const mounted = useMounted()
  const navigate = useNavigate()

  const getInterlinker = useCallback(async () => {
    try {

      if (mounted.current) {
        interlinkersApi.get(interlinkerId).then(res => {
          setInterlinker(res)
        })
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getInterlinker();
  }, [getInterlinker]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Interlinker Details</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box sx={{my: 3}}>
        {interlinker && <InterlinkerHeader interlinker={interlinker} />}

        </Box>
        {interlinker && <InterlinkerDetails interlinker={interlinker} onRelatedInterlinkerClick={() => navigate(`/dashboard/interlinkers/${id}`)} />}
      </Container>

    </>
  );
};

export default InterlinkerProfile;

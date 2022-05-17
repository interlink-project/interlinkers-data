import {
  Box,
  Container
} from '@material-ui/core';
import useMounted from 'hooks/useMounted';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { getLanguage } from 'translations/i18n';
import { interlinkersApi } from '__api__';
import InterlinkerDetails from './InterlinkerDetails';
import InterlinkerHeader from './InterlinkerHeader';

const InterlinkerProfile = () => {
  let { interlinkerId } = useParams();
  const [interlinker, setInterlinker] = useState(null)
  const mounted = useMounted()
  const language = getLanguage()
  const { t } = useTranslation()

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
        <title>{t("Dashboard: Interlinker Details")}</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box sx={{ my: 3 }}>
          {interlinker && <InterlinkerHeader language={language} interlinker={interlinker} />}

        </Box>
        {interlinker && <InterlinkerDetails language={language} interlinker={interlinker} />}
      </Container>
    </>
  );
};

export default InterlinkerProfile;

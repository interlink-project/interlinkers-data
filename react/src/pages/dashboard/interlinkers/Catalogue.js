import { Box, Container, Grid, Typography } from '@material-ui/core';
import { InterlinkerDialog } from 'components/dashboard/interlinkers';
import InterlinkerBrowse from 'components/dashboard/interlinkers/browse/InterlinkerBrowse';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { getLanguage } from 'translations/i18n';

const Catalogue = () => {

  const [open, setOpen] = useState(false);
  const [interlinker, setInterlinker] = useState(null);

  const {t} = useTranslation()
  const language = getLanguage()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Helmet>
        <title>{t("catalogue-title")}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 6
        }}
      >
        <Container maxWidth="lg">
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
                {t("interlinkers-catalogue")}
              </Typography>
            </Grid>
            <Grid item>
              
            </Grid>
          </Grid>
          <InterlinkerBrowse language={language} onInterlinkerClick={(interlinker) => {
            setInterlinker(interlinker)
            handleClickOpen()
          }} />
          <InterlinkerDialog
            language={language}
            interlinker={interlinker}
            open={open}
            setOpen={setOpen}
          />
        </Container>
      </Box>
    </>
  );
};

export default Catalogue;

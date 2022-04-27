import { Box, Button, Container, Fade, Typography, useTheme } from '@material-ui/core';
import { HomeRow } from "components/home";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Interlink</title>
      </Helmet>
      <div>
        <Fade in={true}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              pt: 6,
              pb: 4
            }}
          >
            <Container
              maxWidth='md'
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                px: {
                  md: '130px !important',
                },
                py: 5
              }}
            >
              <img
                alt='Logo'
                src='/static/customization/logo-home.svg'
                style={{ width: "90%", height: "auto" }}
              />
              <Typography
                align='center'
                variant='h5'
                sx={{ my: 5 }}
              >
                {t("home-1-1")}
              </Typography>
              <Button
                color='primary'
                component={RouterLink}
                size='large'
                to='/dashboard'
                variant='contained'
              >
                {t("home-1-2")}

              </Button>
            </Container>
          </Box>
        </Fade>

        <HomeRow
          light={false}
          graphic={<iframe style={{
            minHeight: "300px",
            width: "100%"
          }} src="https://www.youtube.com/embed/oCPz7dxN2Hk" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
          right={<div>
            <Typography variant="h4">
              {t("home-2-1")}

            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3, textAlign: "justify" }}
              variant="subtitle1"
            >
              {t("home-2-2")}

            </Typography>
          </div>}
        />
        <HomeRow
          graphic={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/figure7.png" />}
          right={<>
            <Typography variant="h3">
              {t("home-3-1")}

            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3 }}
              variant="subtitle1"
            >
              {t("home-3-2")}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                m: -1
              }}
            >
              <Button
                onClick={() => navigate('/coprod')}
                size="large"
                sx={{ m: 1 }}
                variant="outlined"
              >
                {t("home-3-3")}
              </Button>
            </Box>
          </>} />



        <HomeRow
          graphic={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/wordcloud-white.png" />}
          light={false}
          right={<>
            <Typography variant="h3">
              {t("home-4-1")}

            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3 }}
              variant="subtitle1"
            >
              {t("home-4-2")}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                m: -1
              }}
            >
              <Button
                onClick={() => navigate('/catal')}
                size="large"
                sx={{ m: 1 }}
                variant="outlined"
              >
                {t("home-4-3")}

              </Button>
            </Box>
          </>} />
        <HomeRow
          graphic={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/map2.png" />}
          right={<>
            <Typography variant="h3">
              {t("home-5-1")}

            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3 }}
              variant="subtitle1"
            >
              {t("home-5-2")}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                m: -1
              }}
            >
              <Button
                onClick={() => navigate('/dashboard')}
                size="large"
                sx={{ m: 1 }}
                variant="outlined"
              >
                {t("home-5-3")}
              </Button>
            </Box>
          </>} />
      </div>
    </>
  );
};

export default Home;

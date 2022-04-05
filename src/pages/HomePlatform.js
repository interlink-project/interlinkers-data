import { Box, Button, Container, Typography } from '@material-ui/core';
import { HomeRow } from 'components/home';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';


const HomePlatform = () => {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Interlink</title>
      </Helmet>
      <div>
        <HomeRow
          graphic={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/comp2.png" />}
          right={<div>
            <Typography variant="h4">
              {t("home-platform-1")}
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3, textAlign: "justify" }}
              variant="subtitle1"
            >
              {t("home-platform-1-1")}
            </Typography>
          </div>}
        />
        <HomeRow
          light={false}
          graphic={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/figure3.png" />}
          right={<div>
            <Typography variant="h4">
              {t("home-platform-2")}

            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3, textAlign: "justify" }}
              variant="subtitle1"
            >
              {t("home-platform-2-1")}

            </Typography>
          </div>}
        />
        <HomeRow
          graphic={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/figure5.png" />}
          right={<div>
            <Typography variant="h4">
              {t("home-platform-3")}

            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3, textAlign: "justify" }}
              variant="subtitle1"
            >
              {t("home-platform-3-1")}

            </Typography>
          </div>}
        />
        <Box
          sx={{
            backgroundColor: 'background.paper',
            py: 5
          }}
        >
          <Container
            maxWidth='md'
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              align='center'
              color='textPrimary'
              variant='h3'
            >
              {t("home-platform-4")}

            </Typography>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                mt: 3
              }}
            >
              <Typography
                align='center'
                color='textPrimary'
                variant='h6'
              >
                {t("home-platform-4-1")}
              </Typography>
            </Box>
            <Button onClick={() => window.open("", "_blank")} fullWidth sx={{ mt: 3, width: "50vw" }}>{t("home-platform-4-2")}</Button>
          </Container>
        </Box>
      </div>
    </>
  );
};

export default HomePlatform;

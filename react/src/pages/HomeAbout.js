import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Divider, Grid, Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import i18n from "translations/i18n";

const sameHeightCards = {
  minHeight: "200px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
}

const pilots = [{
  name: i18n.t("spain"),
  description: i18n.t("home-zaragoza-pilot"),
  image: "/static/graphics/spain.png",
  link: "https://drive.google.com/file/d/1w5GjUWokvWVZKcJ3EQkX3UoPkc4Tmqqc/view?usp=sharing"
},
{
  name: i18n.t("latvia"),
  description: i18n.t("home-latvia-pilot"),
  image: "/static/graphics/latvia.png",
  link: "https://drive.google.com/file/d/1JB8ITHecP7rOnhcd_BbhWqCvj6KI-KS7/view?usp=sharing"
},
{
  name: i18n.t("italy"),
  description: i18n.t("home-italy-pilot"),
  image: "/static/graphics/italy.png",
  link: "https://drive.google.com/file/d/1iWG9rn8jrOhfeSOO2rdLYz4p-BjBOjSS/view?usp=sharing"

}]

const HomeAbout = () => {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Interlink</title>
      </Helmet>
      <div>
        <Container maxWidth="lg" sx={{ my: 2 }}>

          <Grid container alignItems="center" justifyContent="center" spacing={3} sx={{ my: 4 }}>

            <Grid item md={8}>
              <Typography variant="h3" sx={{ textAlign: "center", mb: 3 }}>
                {t("home-about-1")}
              </Typography>
              <Typography variant="body1">
                {t("home-about-1-1")}

              </Typography>

              <Typography variant="body1" sx={{ mt: 2 }}>
                {t("home-about-1-2")}

              </Typography>
            </Grid>
            <Grid item md={4}>
              <img style={{ width: "100%", height: "auto" }} src="/static/graphics/logo-visual.png" />

            </Grid>
          </Grid>

        </Container>


        <Divider />
        <Box
          sx={{
            bgcolor: "primary.main",
            py: 5,
            textAlign: "center"
          }}
        >

          <Typography
            align='center'
            color='primary.contrastText'
            variant='h3'
          >
            {t("home-about-2")}

          </Typography>
        </Box>
        <Container maxWidth='lg' sx={{ mt: 4 }}>
          <Grid
            container
            spacing={3}
            sx={{ pb: 4 }}
          >

            {pilots.map(pilot => <Grid
              key={pilot.name}
              item
              md={4}
              xs={12}
            >
              <Card style={sameHeightCards}>
                <CardMedia
                  component="img"
                  height="400"
                  image={pilot.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {pilot.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pilot.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button size="small" onClick={() => window.open(pilot.link, "_blank")}>{t("home-about-download-brochure")}</Button>
                </CardActions>
              </Card>
            </Grid>)}
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default HomeAbout;

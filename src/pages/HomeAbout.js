import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Divider, Grid, Link, Typography } from '@material-ui/core';
import { HomeRow } from 'components/home';
import { Helmet } from 'react-helmet-async';

const sameHeightCards = {
  minHeight: "200px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
}

const pilots = [{
  name: "SPAIN",
  description: "Zaragoza is using the Interlink governance framework to widen Open Innovation within the city. The framework and set of enablers made available within Interlink are providing support for sustainable Open Innovation in the co-creation and co-delivery of services.",
  image: "/static/graphics/spain.png",
  link: "https://drive.google.com/drive/u/1/folders/17D9kGo4gwLx2QZDD7s4uP3Cn5uQRI7mR"
},
{
  name: "LATVIA",
  description: "The goal of the Latvian Ministry of Environmental Protection and Regional Development Customer Service Centers’ use case is to test sharing service delivery with third parties to improve public services.",
  image: "/static/graphics/latvia.png",
  link: "https://drive.google.com/drive/u/1/folders/173chr_g-LYZ6twMmz-sh5GH1Ea4IylsX"
},
{
  name: "ITALY",
  description: "The Italian Ministry of Economy and Finance together with the Agency for Digital Italy will leverage the Interlink platform and its components to co-create a new module with Reggio Emilia city for a Joint Strategic Planning between central and local Public Bodies.",
  image: "/static/graphics/italy.png",
  link: "https://drive.google.com/drive/u/1/folders/1Tyy4_2Fxf3HZQC0XhK2zMlIPp8m_-Apj"

}]

const HomeAbout = () => {
  return (
    <>
      <Helmet>
        <title>Interlink</title>
      </Helmet>
      <div>
        <HomeRow
          title="COLLABORATION and RE-USE"
          text={[
            "INTERLINK in an European Project that aims to overcome the barriers preventing administrations to reuse and share services with private partners (including citizens) by developing a novel collaborative governance model that merges the enthusiasm and flexibility of grassroot initiatives with the legitimacy and accountability granted by top-down e-government frameworks.",
            "The INTERLINK multidisciplinary consortium will deliver the new governance model and Interlinkers within a technological framework and operational platform based on an open software system leveraging on mobile communications, facilitating the co-production of services between PAs and private stakeholders. The solution will be customised, deployed and evaluated on three use-cases (MEF, VARAM and Zaragoza). Lessons learned in the three use-cases will be generalized to deliver a reusable solution across Europe."
          ]}
          extra2={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/logo-visual.png" />}
        />
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
            Discover more about INTERLINK piloting activities!
          </Typography>
        </Box>
        <Container maxWidth='lg' sx={{ mt: 4 }}>
          <Grid
            container
            spacing={3}
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
                <CardActions sx={{justifyContent: "center"}}>
                  <Button size="small" onClick={() => window.open(pilot.link, "_blank")}>Download the brochure</Button>
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

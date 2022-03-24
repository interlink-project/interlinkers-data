import { Box, Button, Container, Fade, Typography, useTheme } from '@material-ui/core';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { HomeRow } from "components/home"

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
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
                src='/static/graphics/logo-dark.png'
                style={{ width: "90%", height: "auto" }}
              />
              <Typography
                align='center'
                variant='h5'
                sx={{ my: 5 }}
              >
                The collaboration portal to co-produce better and more inclusive public services
              </Typography>
              <Button
                color='primary'
                component={RouterLink}
                size='large'
                to='/dashboard'
                variant='contained'
              >
                Go to dashboard
              </Button>
            </Container>
          </Box>
        </Fade>

        <HomeRow
          light={false}
          graphic={<iframe style={{
            minHeight: "300px",
            width: "100%"
          }} src="https://www.youtube.com/embed/oCPz7dxN2Hk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>}
          right={<div>
            <Typography variant="h4">
              Are you a Public Administration, a company or a citizen that wants to co-design and co-deliver better public services?
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3, textAlign: "justify" }}
              variant="subtitle1"
            >
              The INTERLINK platform will support you in developing public-civic partnerships, co-designing and co-delivering public services. This digital platform to guide step-by-step the co-production and co-delivery of public services is currently being designed, together with a set of open-source reusable resources that will concretely aid the planning and implementation of services. The platform will provide a collaborative environment where the different actors will work together and find the knowledge and tools needed to carry out a joint effort toward the co-delivery of services.
            </Typography>
          </div>}
        />
        <HomeRow
          graphic={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/figure7.png" />}
          right={<>
            <Typography variant="h3">
              Why co-production?
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3 }}
              variant="subtitle1"
            >
              Co-production is a practice in the delivery of public services in which Public Administrations, stakeholders, as well as citizens work hand in hand for the creation of public policies and services.

              In co-production, service providers and users work together to reach a collective outcome. Co-production can help build stronger communities and develops citizenship.

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
                Learn more on coproduction
              </Button>
            </Box>
          </>} />



        <HomeRow
          graphic={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/wordcloud-white.png" />}
          light={false}
          right={<>
            <Typography variant="h3">
              Browse the catalogue of resources
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3 }}
              variant="subtitle1"
            >
              INTERLINK promotes the reuse and sharing of existing public services and resources leveraging on the partnership between citizens, private actors, and public administrations.

              INTERLINK provides a set of digital building blocks, called “INTERLINKERs”, that support different stakeholders to cooperate in the delivery of a service.
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
                Browse the catalogue
              </Button>
            </Box>
          </>} />
        <HomeRow
          graphic={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/map2.png" />}
          right={<>
            <Typography variant="h3">
              Join active co-production process
            </Typography>
            <Typography
              color="textSecondary"
              sx={{ my: 3 }}
              variant="subtitle1"
            >
              INTERLINK is being used in different European Countries to carry out co-production projects. Discover who is using INTERLINK and join active co-production projects!

              Register to the INTERLINK platform and discover active projects!
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
                Go to dashboard
              </Button>
            </Box>
          </>} />
      </div>
    </>
  );
};

export default Home;

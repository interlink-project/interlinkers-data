import { Container, Avatar, Box, Typography, Button, Divider } from '@material-ui/core';
import { HomeRow } from 'components/home';
import { Helmet } from 'react-helmet-async';


const HomePlatform = () => {
  return (
    <>
      <Helmet>
        <title>Interlink</title>
      </Helmet>
      <div>
        <HomeRow
          title="COLLABORATION and RE-USE"
          text={[
            "The INTERLINK platform offers a digital environment that facilitates co-production processes between Public Administrations, private stakeholders and citizens and promotes the re-use of software for the delivery of public services.",
            "In INTERLINK, different actors can work together and find the knowledge and tools needed to carry out a joint effort towards the co-design and co-delivery of services"
          ]}
          extra2={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/comp2.png" />}
        />
        <HomeRow
          title="CO-DESIGN and CO-DELIVERY"
          text={[
            "During the co-production process, several questions and problems emerge. INTERLINK guides the whole process: from the creation of the initial workplan to the recommendation of software that can be re-used in your project.",
            "INTERLINK provides a  step-by-step guidance for  the co-production and co-delivery of public services along with guidelines, tips and templates that facilitate the collaboration"
          ]}
          extra2={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/figure3.png" />}
          variance
        />
        <HomeRow
          title="INTERLINKERS"
          text={[
            "INTERLINK facilitates sharing and re-use of knowledge, software and services.</b><br />INTERLINKERs are pieces of knowledge or software that your team can re-use and customize to deliver services. They are digital building blocks that solve problems that a team of stakeholders might encounter during the whole process: guidelines, best practices, templates, examples and re-usable software support the whole co-production life-cycle, from the initial phase of network development to the final co-delivery and monitoring of the service. These resources help the collaborative design of new solutions that put user needs at the center."
          ]}
          extra2={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/figure5.png" />}
        />
        <Divider />
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
              Learn more about the platform usage
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
                For FAQ and tips on how to use the platform, please download the user manual
              </Typography>
              
            </Box>
            <Button onClick={() => window.open("", "_blank")} fullWidth sx={{mt: 3, width: "50vw"}}>Download user manual</Button>
          </Container>
        </Box>
      </div>
    </>
  );
};

export default HomePlatform;

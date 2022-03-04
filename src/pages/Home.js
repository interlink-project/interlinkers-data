import { Button } from '@material-ui/core';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  HomeHero, HomeRow
} from '../components/home';

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Interlink</title>
      </Helmet>
      <div>
        <HomeHero />
        <HomeRow
          title="Are you a Public Administration, a company or a citizen that wants to co-design and co-deliver better public services?"
          text={[
            "The INTERLINK platform will support you in developing public-civic partnerships, co-designing and co-delivering public services. This digital platform to guide step-by-step the co-production and co-delivery of public services is currently being designed, together with a set of open-source reusable resources that will concretely aid the planning and implementation of services. The platform will provide a collaborative environment where the different actors will work together and find the knowledge and tools needed to carry out a joint effort toward the co-delivery of services."
          ]}
          extra2={<iframe width="560" height="315" src="https://www.youtube.com/embed/oCPz7dxN2Hk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>}
          variance
        />
        <HomeRow
          title="Why co-production?"
          text={[
            "Co-production is a practice in the delivery of public services in which Public Administrations, stakeholders, as well as citizens work hand in hand for the creation of public policies and services.", 
            "In co-production, service providers and users work together to reach a collective outcome. Co-production can help build stronger communities and develops citizenship."
          ]}
          extra1={<Button onClick={() => navigate('/coprod')} sx={{ mt: 3 }} variant="outlined" color="inherit" fullWidth>Learn more on co-production</Button>}
          extra2={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/figure7.png" />}
        />
        <HomeRow
          title="Browse the catalogue of resources"
          text={[
            "INTERLINK promotes the reuse and sharing of existing public services and resources leveraging on the partnership between citizens, private actors, and public administrations.",
            "INTERLINK provides a set of digital building blocks, called “INTERLINKERs”, that support different stakeholders to cooperate in the delivery of a service."
          ]}
          extra1={<Button color="inherit" variant="outlined" sx={{mt: 3}} fullWidth>Browse the catalogue</Button>}
          extra2={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/wordcloud-white.png" />}
          variance
        />
        <HomeRow
          title="Join active co-production process"
          text={[
            "INTERLINK is being used in different European Countries to carry out co-production projects. Discover who is using INTERLINK and join active co-production projects!", 
            "Register to the INTERLINK platform and discover active projects!"
          ]}
          extra1={<Button onClick={() => navigate('/dashboard')} sx={{ mt: 3 }} variant="outlined" color="inherit" fullWidth>Go to the dashboard</Button>}
          extra2={<img style={{ width: "100%", height: "auto" }} src="/static/graphics/map2.png" />}
        />
      </div>
    </>
  );
};

export default Home;

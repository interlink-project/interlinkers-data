import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  HomeClients,
  HomeHero,
  HomeOverview,
  HomeRoles,
  HomeFeatures,
  HomeTestimonials,
} from '../my_components/home';
import gtm from '../lib/gtm';

const Home = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Interlink</title>
      </Helmet>
      <div>
        <HomeHero />
        {/*
        <HomeOverview />
        <HomeRoles />
        <HomeTestimonials />
        <HomeFeatures />
        <HomeClients /> */}
      </div>
    </>
  );
};

export default Home;

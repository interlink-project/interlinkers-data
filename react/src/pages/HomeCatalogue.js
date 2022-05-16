import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import Loadable from 'routes/Loadable';

const InterlinkerBrowse = Loadable(
  lazy(() => import('../components/dashboard/interlinkers/browse/InterlinkerBrowse'))
);

const HomeCatalogue = () => {
  return (
    <>
      <Helmet>
        <title>Interlink: Catalogue</title>
      </Helmet>
      <div>
        <InterlinkerBrowse />
      </div>
    </>
  );
};

export default HomeCatalogue;

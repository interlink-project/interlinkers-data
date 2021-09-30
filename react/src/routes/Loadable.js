import { Suspense } from 'react';
import LoadingScreen from '../tm_components/LoadingScreen';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;

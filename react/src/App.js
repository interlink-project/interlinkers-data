import { useMatomo } from '@datapunt/matomo-tracker-react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import RTL from './components/RTL';
import SplashScreen from './components/SplashScreen';
import { PRODUCTION_MODE } from './configuration';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import routes from './routes/index';
import './translations/i18n';

export const RemoveTrailingSlash = ({ ...rest }) => {
  const location = useLocation()

  // If the last character of the url is '/'
  if (location.pathname.match('/.*/$')) {
    return <Navigate replace {...rest} to={{
      pathname: location.pathname.replace(/\/+$/, ""),
      search: location.search
    }} />
  } else return null
}

const App = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();

  useScrollReset();

  // ANALYTICS
  const { enableLinkTracking, trackPageView} = useMatomo()
  enableLinkTracking()
  useEffect(() => {
    trackPageView()
  }, [])

  return settings.loaded ? (
    <ThemeProvider theme={settings.themeData}>
      <RTL direction={settings.direction}>
        <CssBaseline />
        <Toaster position='top-center' />
        <Helmet>
          {PRODUCTION_MODE && <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>}
        </Helmet>
        <RemoveTrailingSlash />
        {auth.isInitialized ? content : <SplashScreen />}
      </RTL>
    </ThemeProvider>
  ) : <SplashScreen />;
};

export default App;

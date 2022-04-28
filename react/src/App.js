import { CssBaseline, ThemeProvider } from '@material-ui/core';
import useMounted from 'hooks/useMounted';
import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { getProblemProfiles } from 'slices/general';
import RTL from './components/RTL';
import SplashScreen from './components/SplashScreen';
import { env } from './configuration';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import routes from './routes/index';
import './translations/i18n';


const App = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();
  const dispatch = useDispatch();
  const mounted = useMounted()

  useScrollReset();

  const getInitialInfo = useCallback(async () => {
    try {

      if (mounted.current) {
        dispatch(getProblemProfiles())
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getInitialInfo();
  }, [getInitialInfo]);

  return settings.loaded ? (
    <ThemeProvider theme={settings.themeData}>
      <RTL direction={settings.direction}>
        <CssBaseline />
        <Toaster position='top-center' />
        <Helmet>
          {env.NODE_ENV === "production" && <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>}
        </Helmet>
        {auth.isInitialized ? content : <SplashScreen />}
      </RTL>
    </ThemeProvider>
  ) : <SplashScreen />;
};

export default App;

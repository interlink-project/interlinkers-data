import { useCallback, useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

import RTL from './components/RTL';
import SplashScreen from './components/SplashScreen';
import { env } from './configuration';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import routes from './routes/index';
import { createCustomTheme } from './theme';
import './translations/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { getProblemProfiles } from 'slices/general';
import useMounted from 'hooks/useMounted';

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


  const theme = createCustomTheme({
    direction: settings.direction,
    theme: settings.theme
  });

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={settings.direction}>
        <CssBaseline />
        <Toaster position='top-center' />
        <Helmet>
          {env.NODE_ENV === "production" && <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>}
        </Helmet>
        {auth.isInitialized ? content : <SplashScreen />}
      </RTL>
    </ThemeProvider>
  );
};

export default App;

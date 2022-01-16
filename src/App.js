import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

import RTL from './components/RTL';
import SplashScreen from './components/SplashScreen';
import { gtmConfig } from './config';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import gtm from './lib/gtm';
import routes from './routes/index';
import { createCustomTheme } from './theme';
import './translations/i18n';
import { setStatus } from 'slices/catalogue';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();
  const dispatch = useDispatch();
  useScrollReset();

  const create_websocket = () => {
    return new WebSocket('ws://localhost/catalogue/connect/')
  }
  const [websocket, setWebsocket] = useState(create_websocket())
  const [tries, setTries] = useState(0)

  useEffect(() => {
    // gtm.initialize(gtmConfig);

    if (false) {
      websocket.onopen = () => {
        // on connecting, do nothing but log it to the console
        console.log('connected')
        setTries(0)
      }

      websocket.onmessage = evt => {
        // listen to data sent from the websocket server
        const message = JSON.parse(evt.data)
        console.log(message)

        if (message.event === "NEW_STATUS"){
          dispatch(setStatus(message.payload))
        }
      }
      websocket.onclose = () => {
        console.log('disconnected')
        // automatically try to reconnect on connection loss
        const ws = create_websocket()
        setTries(tries + 1)
        if (tries < 5) {
          setWebsocket(ws)
        }
       
      }
    }

  }, [websocket]);

  const theme = createCustomTheme({
    direction: settings.direction,
    theme: settings.theme
  });

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={settings.direction}>
        <CssBaseline />
        <Toaster position='top-center' />
        {auth.isInitialized ? content : <SplashScreen />}
      </RTL>
    </ThemeProvider>
  );
};

export default App;

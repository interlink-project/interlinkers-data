import { createInstance, MatomoProvider } from '@datapunt/matomo-tracker-react';
import StyledEngineProvider from '@material-ui/core/StyledEngineProvider';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { REACT_APP_COMPLETE_DOMAIN, REACT_APP_MATOMO_ID } from 'configuration';
import 'nprogress/nprogress.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/CookieContext';
import { SettingsProvider } from './contexts/SettingsContext';
import store from './store';

const instance = createInstance({
  urlBase: REACT_APP_COMPLETE_DOMAIN + '/matomo/',
  siteId: REACT_APP_MATOMO_ID,
  linkTracking: false
})

ReactDOM.render(
  <StrictMode>
    <MatomoProvider value={instance}>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <StyledEngineProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider>
                <BrowserRouter>
                  <AuthProvider>
                    <App />
                  </AuthProvider>
                </BrowserRouter>
              </SettingsProvider>
            </LocalizationProvider>
          </StyledEngineProvider>
        </ReduxProvider>
      </HelmetProvider>
    </MatomoProvider>
  </StrictMode>
  ,
  document.getElementById('root')
);

import axios from 'axios';
import { REACT_APP_COMPLETE_DOMAIN } from 'configuration';
import { getLanguage } from 'translations/i18n';
import qs from 'qs';

export const getImageUrl = (micro, path) => path && `/${micro}${path}`;

// https://stackoverflow.com/questions/42898009/multiple-fields-with-same-key-in-query-params-axios-request/46153494#46153494

const axiosInstance = axios.create({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  baseURL: REACT_APP_COMPLETE_DOMAIN,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    'Accept-Language': getLanguage(),
  },
});

export default axiosInstance;

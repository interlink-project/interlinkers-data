import axios from 'axios'
import { env } from 'configuration'
import { getInitialLanguage } from 'translations/i18n'
import qs from "qs"

export const getImageUrl = (micro, path) => path && `/${micro}${path}`

// https://stackoverflow.com/questions/42898009/multiple-fields-with-same-key-in-query-params-axios-request/46153494#46153494

const axiosInstance = axios.create({
  paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'}),
  baseURL: env.REACT_APP_COMPLETE_DOMAIN,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    // 'Accept-Language': getInitialLanguage(),
  },
})

axiosInstance.interceptors.request.use(
  config => {
    config.headers["Accept-Language"] = getInitialLanguage();
    // console.log("2", config)
    return config;
  },  
);

export default axiosInstance

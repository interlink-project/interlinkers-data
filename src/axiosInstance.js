import axios from 'axios'
import { env } from 'configuration'
import { getInitialLanguage } from 'translations/i18n'

export const getImageUrl = (micro, path) => path && `/${micro}${path}`

const axiosInstance = axios.create({
  baseURL: env.REACT_APP_COMPLETE_DOMAIN,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    // 'Accept-Language': getInitialLanguage(),
  },
})

axiosInstance.interceptors.request.use(
  config => {
    config.headers["Accept-Language"] = getInitialLanguage();
    console.log("2", config)
    return config;
  },  
);

export default axiosInstance

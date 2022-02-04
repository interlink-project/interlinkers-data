import axios from 'axios'
import { env } from 'configuration'
import store from 'store'

// https://thedutchlab.com/blog/using-axios-interceptors-for-refreshing-your-api-token

/*
export const getAccessToken = () => store.get('accessToken')

export const setAuthHeader = (accessToken) => {
  if (accessToken) {
    axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
  } else {
    delete axiosInstance.defaults.headers.Authorization
  }
}
*/

export const getImageUrl = (micro, path) => path && `/${micro}${path}`

const axiosInstance = axios.create({
  baseURL: env.REACT_APP_COMPLETE_DOMAIN,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    // 'Accept-Language': store.get('language', 'es'),
  },
})

export default axiosInstance

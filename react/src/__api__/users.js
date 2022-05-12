import axiosInstance from 'axiosInstance';
import GeneralApi from './general';

class UsersApi extends GeneralApi {
  constructor() {
    super('auth/api/v1/users', 'users_cache');
  }

  async get(id) {
    return axiosInstance.get(`/${this.url}/${id}`);
  }

  async me() {
    const res = await axiosInstance.get(`/${this.url}/me`);
    console.log('get me call', res, res.data);
    return res.data;
  }
}

export const usersApi = new UsersApi();

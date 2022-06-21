import axiosInstance from 'axiosInstance';
import GeneralApi from './general';

class UsersApi extends GeneralApi {
  constructor() {
    super('auth/api/v1/users', 'users_cache');
  }

  async get(id) {
    return axiosInstance.get(`/${this.url}/${id}`);
  }

  async search(search, organization_id = null) {
    const ser = `by=${search}`
    const org = organization_id ? `organization_id=${organization_id}` : ""
    const res = await axiosInstance.get(`/coproduction/api/v1/users/search?${ser}&${org}`);
    console.log('get users call', res.data)
    return res.data
  }

  async me() {
    // Call auth microservice first in order to create an account if it does not exist
    const res = await axiosInstance.get(`/auth/api/v1/users/me`);
    // Coproduction service gets user data from the auth service
    const res2 = await axiosInstance.get(`/coproduction/api/v1/users/me`);
    const me = {...res.data, ...res2.data}
    console.log('get me call', me);
    return me;
  }
}

export const usersApi = new UsersApi();

import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class TeamsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/teams');
  }

  async addUser(id, user_id) {
    console.log(`/${this.url}/${id}/add_user`, user_id);
    const res = await axiosInstance.post(
      `/${this.url}/${id}/add_user`,
      { user_id }
    );
    console.log('add user call', res.data);
    return res.data;
  }

  async getMine() {
    const res = await axiosInstance.get(
      `/${this.url}/mine`
    );
    console.log('getMine call', res.data);
    return res.data;
  }
}

export const teamsApi = new TeamsApi();

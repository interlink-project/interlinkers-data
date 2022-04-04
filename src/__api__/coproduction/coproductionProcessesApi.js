import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class CoproductionProcessesApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/coproductionprocesses");
  }

  async addTeam(id, team_id) {
    if (id) {
      const res = await axiosInstance.post(`/${this.url}/${id}/add_team`, {team_id})
      console.log('add team', res.data);
      return res.data
    }
  }

  async addUser(id, user_id) {
    if (id) {
      console.log({user_id})
      const res = await axiosInstance.post(`/${this.url}/${id}/add_user`, {user_id})
      console.log('add user', res.data);
      return res.data
    }
  }

  async myRoles(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/my_roles`)
      console.log('my roles', res.data);
      return res.data
    }
  }


  async getTree(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/tree`)
      console.log('get tree', res.data);
      return res.data
    }
  }

  async setSchema(id, coproductionschema_id) {
    if (id) {
      const res = await axiosInstance.post(`/${this.url}/${id}/set_schema`, {coproductionschema_id})
      console.log('set schema', res.data);
      return res.data
    }
  }

  async getMine() {
    const res = await axiosInstance.get(
      `/${this.url}/mine`
    );
    console.log('getMine call', res.data);
    return res.data;
  }
}

export const coproductionProcessesApi = new CoproductionProcessesApi();

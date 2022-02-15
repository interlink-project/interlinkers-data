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

  async getMine() {
    const res = await axiosInstance.get(
      `/${this.url}/mine`
    );
    console.log('getMine call', res.data);
    return res.data;
  }

  async getPhases(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/phases`)
      console.log('get phases', res.data);
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
}

export const coproductionProcessesApi = new CoproductionProcessesApi();

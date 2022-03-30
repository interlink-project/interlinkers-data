import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class RolesApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/roles");
  }
  async addTeam(id, team_id) {
    if (id) {
      const res = await axiosInstance.post(`/${this.url}/${id}/add_team`, {team_id})
      console.log('add team', res.data);
      return res.data
    }
  }
  async switcRole(data) {
    const res = await axiosInstance.post(
      `/switch`,
      data
    );
    console.log('switch roles call', res.data);
    return res.data;
  }

}

export const rolesApi = new RolesApi();

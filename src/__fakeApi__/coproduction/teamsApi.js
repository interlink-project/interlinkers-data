import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class TeamsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/teams");
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

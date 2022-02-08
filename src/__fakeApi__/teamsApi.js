import axiosInstance from 'axiosInstance';
import GeneralApi from "./general"

class TeamsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/teams");
  }
}

export const teamsApi = new TeamsApi();

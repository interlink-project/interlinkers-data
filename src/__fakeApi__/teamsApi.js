import axiosInstance from 'axiosInstance';
import GeneralApi from "./general"

class TeamsApi extends GeneralApi {
  constructor() {
    super("teammanagement/api/v1/teams");
  }
}

export const teamsApi = new TeamsApi();

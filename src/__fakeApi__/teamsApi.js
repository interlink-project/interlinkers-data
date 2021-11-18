import axiosInstance from 'axiosInstance';
import GeneralApi from "./general"

class TeamsApi extends GeneralApi {
  constructor() {
    super("teams");
  }
}

export const teamsApi = new TeamsApi();

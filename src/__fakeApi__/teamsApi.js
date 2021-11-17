import axiosInstance from '../axios';
import GeneralApi from "./general"

class TeamsApi extends GeneralApi {
  constructor() {
    super("teams");
  }
}

export const teamsApi = new TeamsApi();

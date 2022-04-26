import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class PhasesApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/phases");
  }

  async getObjectives(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/objectives`)
      console.log('get objectives', res.data);
      return res.data
    }
  }
}

export const phasesApi = new PhasesApi();

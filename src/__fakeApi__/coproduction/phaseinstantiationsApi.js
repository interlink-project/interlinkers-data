import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class PhaseinstantiationsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/phaseinstantiations");
  }

  async getObjectiveInstantiations(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/objectiveinstantiations`)
      console.log('get objectiveinstantiations', res.data);
      return res.data
    }
  }
}

export const phaseinstantiationsApi = new PhaseinstantiationsApi();

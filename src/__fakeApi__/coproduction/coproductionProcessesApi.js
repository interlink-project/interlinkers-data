import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class CoproductionProcessesApi extends GeneralApi {
  constructor() {
    super("coproductionprocesses");
  }

  async getPhaseInstantiations(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/phaseinstantiations`)
      console.log('get phaseinstantiations', res.data);
      return res.data
    }
  }
}

export const coproductionProcessesApi = new CoproductionProcessesApi();

import axiosInstance from '../axios';
import GeneralApi from "./general"

class CoproductionProcessesApi extends GeneralApi {
  constructor() {
    super("coproductionprocesses");
  }

  async getPhases(id) {
    
    const res = await axiosInstance.get(
      `/${this.url}/${id}/phaseinstantiations`
    );
    console.log('getPhases call', res.data);
    return res.data;
  }
}

export const coproductionProcessesApi = new CoproductionProcessesApi();

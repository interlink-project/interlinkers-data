import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class CoproductionProcessesApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/coproductionprocesses");
  }

  async getPhases(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/phases`)
      console.log('get phases', res.data);
      return res.data
    }
  }

  async getTree(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/tree`)
      console.log('get tree', res.data);
      return res.data
    }
  }
}

export const coproductionProcessesApi = new CoproductionProcessesApi();

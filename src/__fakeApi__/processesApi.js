import axiosInstance from '../axios';
import GeneralApi from "./general"

class CoproductionProcessesApi extends GeneralApi {
  constructor() {
    super("coproductionprocesses");
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

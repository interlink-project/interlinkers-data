import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class TaskinstantiationsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/taskinstantiations");
  }

  async getAssets(id) {
    const res = await axiosInstance.get(`/${this.url}/${id}/assets`)
    console.log('get assets call', res, res.data);
    return res.data
  }
}

export const taskinstantiationsApi = new TaskinstantiationsApi();

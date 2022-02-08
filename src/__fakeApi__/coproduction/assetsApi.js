import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class AssetsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/assets");
  }

  async create(task_id, interlinker_id, external_id) {
    const res = await axiosInstance.post(`/${this.url}`, {
      task_id,
      interlinker_id,
      external_id
    })
    console.log('post call', res, res.data);
    return res.data
  }
}

export const assetsApi = new AssetsApi();

import axiosInstance from '../axios';
import GeneralApi from "./general"

class AssetsApi extends GeneralApi {
  constructor() {
    super("assets");
  }

  async create(taskinstantiation_id, interlinkerversion_id) {
    console.log(taskinstantiation_id, interlinkerversion_id)
    const res = await axiosInstance.post(`/${this.url}`, {
      taskinstantiation_id,
      interlinkerversion_id
    })
    console.log('post call', res, res.data);
    return res.data
  }
}

export const assetsApi = new AssetsApi();

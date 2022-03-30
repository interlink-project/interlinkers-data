import axiosInstance from 'axiosInstance';
import GeneralApi from "../general";

class AssetsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/assets");
  }

  async create(task_id, softwareinterlinker_id, knowledgeinterlinker_id, external_asset_id) {
    const res = await axiosInstance.post(`/${this.url}`, {
      task_id,
      softwareinterlinker_id,
      knowledgeinterlinker_id,
      external_asset_id
    })
    console.log('post call', res, res.data);
    return res.data
  }

  async clone(id) {
    const res = await axiosInstance.post(`/${this.url}/${id}/clone`)
    console.log('post clone call', res, res.data);
    return res.data
  }

  async getExternal(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/external/${id}`)
      console.log('get external call', res.data);
      return res.data
    }
  }
}

export const assetsApi = new AssetsApi();

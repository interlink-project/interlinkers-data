import axiosInstance from 'axiosInstance';
import GeneralApi from "../general";

class AssetsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/assets");
  }

  async create_internal(task_id, softwareinterlinker_id, external_asset_id) {
    const res = await axiosInstance.post(`/${this.url}`, {
      task_id,
      softwareinterlinker_id,
      external_asset_id,
      type: "internalasset"
    })
    console.log('post call', res, res.data);
    return res.data
  }

  async create_external(task_id, externalinterlinker_id, name, uri) {
    const res = await axiosInstance.post(`/${this.url}`, {
      task_id,
      externalinterlinker_id,
      name,
      uri,
      type: "externalasset"
    })
    console.log('post call', res, res.data);
    return res.data
  }

  async instantiate(knowledgeinterlinker_id, task_id) {
    const res = await axiosInstance.post(`/${this.url}/instantiate`, {
      knowledgeinterlinker_id,
      task_id
    })
    console.log('post instantiate call', res, res.data);
    return res.data
  }

  async clone(id) {
    const res = await axiosInstance.post(`/${this.url}/${id}/clone`)
    console.log('post clone call', res, res.data);
    return res.data
  }

  async getInternal(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/internal/${id}`)
      console.log('get internal call', res.data);
      return res.data
    }
  }
}

export const assetsApi = new AssetsApi();

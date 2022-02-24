import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class RepresentationsApi extends GeneralApi {
  constructor() {
    super("catalogue/api/v1/representations");
  }

  async clone(id) {
    const res = await axiosInstance.post(`/${this.url}/${id}/clone`)
    console.log('post clone call', res, res.data);
    return res.data
  }

  async create(task_id, interlinker_id, external_representation_id) {
    const res = await axiosInstance.post(`/${this.url}`, {
      task_id,
      interlinker_id,
      external_representation_id
    })
    console.log('post call', res, res.data);
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

export const representationsApi = new RepresentationsApi();

import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class ObjectivesApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/objectives");
  }

  async getTasks(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/tasks`)
      console.log('get tasks', res.data);
      return res.data
    }
  }
}

export const objectivesApi = new ObjectivesApi();

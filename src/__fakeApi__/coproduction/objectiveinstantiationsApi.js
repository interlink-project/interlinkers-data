import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class ObjectiveInstantiationsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/objectiveinstantiations");
  }

  async getTaskInstantiations(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/taskinstantiations`)
      console.log('get taskinstantiations', res.data);
      return res.data
    }
  }
}

export const objectiveinstantiationsApi = new ObjectiveInstantiationsApi();

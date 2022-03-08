import axiosInstance from 'axiosInstance';
import GeneralApi, { removeEmpty } from "../general"

class RatingsApi extends GeneralApi {
  constructor() {
    super("catalogue/api/v1/ratings");
  }

  async getMulti(artefact_id, params = {}) {
    const res = await axiosInstance.get(
      `/catalogue/api/v1/interlinkers/${artefact_id}/ratings`, {
        params: removeEmpty(params)
      }
    );
    console.log('getMulti call', res.data);
    return res.data;
  }


  async create(title, text, value, artefact_id) {
    const res = await axiosInstance.post(`/${this.url}`, {
      title, text, value, artefact_id
    })
    console.log('post call', res, res.data);
    return res.data
  }

}

export const ratingsApi = new RatingsApi();

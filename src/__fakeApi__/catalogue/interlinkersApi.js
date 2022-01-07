import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class InterlinkersApi extends GeneralApi {
  constructor() {
    super("catalogue/api/v1/interlinkers");
  }

  async status() {
    const res = await axiosInstance.get(`/catalogue/interlinkers_status`)
    console.log('status call', res.data);
    return res.data
  }
}

export const interlinkersApi = new InterlinkersApi();

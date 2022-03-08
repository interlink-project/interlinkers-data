import axiosInstance from 'axiosInstance';
import GeneralApi, { removeEmpty } from "../general"

class SoftwareInterlinkersApi extends GeneralApi {
  constructor() {
    super("catalogue/api/v1/softwareinterlinkers");
  }

  async getIntegrated(params = {}) {
    const res = await axiosInstance.get(
      `/${this.url}/integrated`, {
        params: removeEmpty(params)
      }
    );
    console.log('getIntegrated call', res.data);
    return res.data;
  }
}

export const softwareInterlinkersApi = new SoftwareInterlinkersApi();

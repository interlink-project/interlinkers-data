import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class CoproductionSchemasApi extends GeneralApi {
  constructor() {
    super('catalogue/api/v1/coproductionschemas');
  }

  async getPublic(language) {
    const res = await axiosInstance.get(`/${this.url}/public`, {
      headers: {
        'Accept-Language': language
      }
    });
    console.log('get public schemas in', language, res.data);
    return res.data;
  }
}

export const coproductionSchemasApi = new CoproductionSchemasApi();

import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class CoproductionSchemasApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/coproductionschemas");
  }

  async getPublic() {
    const res = await axiosInstance.get(`/${this.url}/public`)
    console.log('get public schemas', res.data);
    return res.data
  }
}

export const coproductionSchemasApi = new CoproductionSchemasApi();

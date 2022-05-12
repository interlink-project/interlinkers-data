import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class KnowledgeInterlinkersApi extends GeneralApi {
  constructor() {
    super('catalogue/api/v1/knowledgeinterlinkers');
  }

  /*
  async getInternal(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/internal`)
      console.log('get internal call', res.data);
      return res.data
    }
  }
  */
}

export const knowledgeInterlinkersApi = new KnowledgeInterlinkersApi();

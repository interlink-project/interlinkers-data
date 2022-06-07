import axiosInstance from 'axiosInstance';
import { getLanguage } from 'translations/i18n';
import GeneralApi, { removeEmpty } from '../general';

class InterlinkersApi extends GeneralApi {
  constructor() {
    super('catalogue/api/v1/interlinkers', 'interlinkers_cache');
  }

  async getRelated(page, size, id) {
    const res = await axiosInstance.get(
      `/${this.url}/${id}/related`, {
        params: removeEmpty({
          page,
          size
        })
      }
    );
    console.log('related call', res.data);
    return res.data;
  }
}

export const interlinkersApi = new InterlinkersApi();

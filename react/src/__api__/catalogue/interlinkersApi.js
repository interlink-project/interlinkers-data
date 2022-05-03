import axiosInstance from 'axiosInstance';
import { getLanguage } from 'translations/i18n';
import GeneralApi, { removeEmpty } from "../general"

class InterlinkersApi extends GeneralApi {
  constructor() {
    super("catalogue/api/v1/interlinkers", "interlinkers_cache");
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

  async getByProblemProfiles(page, size, problemprofiles, language = getLanguage()) {
    const res = await axiosInstance.post(
      `/${this.url}/by_problemprofiles`, problemprofiles, {
      params: removeEmpty({
        page,
        size
      }),
      headers: {
        "Accept-Language": language
      }
    }
    );
    console.log('by problem profiles call', res.data);
    return res.data;
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

  async status() {
    const res = await axiosInstance.get(`/catalogue/interlinkers_status`)
    console.log('status call', res.data);
    return res.data
  }
}

export const interlinkersApi = new InterlinkersApi();

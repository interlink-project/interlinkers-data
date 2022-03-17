import axiosInstance from 'axiosInstance';
import store from 'store';
import GeneralApi, { removeEmpty } from "../general"

class InterlinkersApi extends GeneralApi {
  constructor() {
    super("catalogue/api/v1/interlinkers");
  }

  async get_cache(id) {
    if (id) {
      const interlinkers = store.get("interlinkers_cache", [])
      const search = interlinkers.find(el => el.id === id)
      if (!search) {
        const res = this.get(id)
        store.set("interlinkers_cache", [...store.get("interlinkers_cache", []), res])
      } else {
        return search
      }
    }
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

  async getByProblemProfiles(page, size, problem_profiles) {
    const res = await axiosInstance.post(
      `/${this.url}/by_problem_profiles`, problem_profiles, {
      params: removeEmpty({
        page,
        size
      })
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

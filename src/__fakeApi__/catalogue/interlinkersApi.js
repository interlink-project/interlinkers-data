import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class InterlinkersApi extends GeneralApi {
  constructor() {
    super("catalogue/api/v1/interlinkers");
  }

  async getSoftwareInterlinkers(skip = null, limit = null) {
    const searchparams = new URLSearchParams();
    if (skip) {
      searchparams.set('skip', skip);
    }
    if (limit) {
      searchparams.set('limit', limit);
    }
    const newparams = searchparams.toString();
    const res = await axiosInstance.get(
      `/${this.url}/software${newparams ? `?${newparams}` : ''}`
    );
    console.log('getSoftware call', res.data);
    return res.data;
  }

  async get_by_problem_profiles(problem_profiles) {
    const res = await axiosInstance.post(
      `/${this.url}/by_problem_profiles`, {
        problem_profiles
      }
    );
    console.log('by problem profiles call', res.data);
    return res.data;
  }

  async search(search, nature) {
    const searchparams = new URLSearchParams();
    if (search) {
      searchparams.set('search', search);
    }
    if (nature) {
      searchparams.set('nature', nature);
    }
    const newparams = searchparams.toString();
    const res = await axiosInstance.get(
      `/${this.url}/${newparams ? `?${newparams}` : ''}`
    );
    console.log('search call', res.data);
    return res.data;
  }

  async status() {
    const res = await axiosInstance.get(`/catalogue/interlinkers_status`)
    console.log('status call', res.data);
    return res.data
  }
}

export const interlinkersApi = new InterlinkersApi();

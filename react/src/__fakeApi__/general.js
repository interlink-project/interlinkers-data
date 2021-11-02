import axiosInstance from '../axios';

export default class GeneralApi {
  constructor(url) {
    this.url = url;
  }

  async getMulti(skip = null, limit = null) {
    const searchparams = new URLSearchParams();
    if (skip) {
      searchparams.set('skip', skip);
    }
    if (limit) {
      searchparams.set('limit', limit);
    }
    const newparams = searchparams.toString();
    const res = await axiosInstance.get(
      `/${this.url}/${newparams ? `?${newparams}` : ''}`
    );
    console.log('getMulti call', res.data);
    return res.data;
  }

  async get(id) {
    const res = await axiosInstance.get(`/${this.url}/${id}`)
    console.log('get call', res.data);
    return res.data
  }
}

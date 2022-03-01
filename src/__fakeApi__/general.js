import axiosInstance from 'axiosInstance';

export default class GeneralApi {
  constructor(url) {
    this.url = url;
  }

  async create(data) {
    return axiosInstance.post(`/${this.url}`, data)
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
      `/${this.url}${newparams ? `?${newparams}` : ''}`
      );
    console.log('getMulti call', res.data);
    return res.data;
  }

  async update(id, data) {
    if (id) {
      const res = await axiosInstance.put(`/${this.url}/${id}`, data)
      console.log('update call', res.data);
      return res.data
    }
  }

  async get(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}`)
      console.log('get call', res.data);
      return res.data
    }
  }

  async delete(id) {
    if (id) {
      const res = await axiosInstance.delete(`/${this.url}/${id}`)
      console.log('delete call', res.data);
      return res.data
    }
  }

  async setFile(id, endpoint, file) {
    let formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post(
      `/${this.url}/${id}/${endpoint}`,
      formData,
      {
        headers: {
            "Content-type": "multipart/form-data",
        },                    
    }
    );
    console.log('setLogotype call', res.data);
    return res;
  }
}

import axiosInstance from 'axiosInstance';

export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

export default class GeneralApi {
  constructor(url) {
    this.url = url;
  }

  async create(data) {
    return axiosInstance.post(`/${this.url}`, data)
  }

  async getMulti(params = {}) {
    console.log("GETTING WITH", removeEmpty(params))
    const res = await axiosInstance.get(
      `/${this.url}`, {
        params: removeEmpty(params)
      }
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

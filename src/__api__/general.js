import axiosInstance from 'axiosInstance';
import store from 'store';

export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

export default class GeneralApi {
  constructor(url, cache_key = "") {
    this.url = url;
    this.cache_key = cache_key
  }

  async get_cache(id) {
    if (this.cache_key) {
      const objects = store.get(this.cache_key, [])
      const search = objects.find(el => el.id === id)
      if (!search) {
        const res = await this.get(id)
        store.set(this.cache_key, [...store.get(this.cache_key, []), res])
        return res
      } else {
        return search
      }
    }
  }

  async create(data) {
    return axiosInstance.post(`/${this.url}`, data)
  }

  async getMulti(params = {}) {
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

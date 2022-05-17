import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class LogsApi extends GeneralApi {
  constructor() {
    super('logging/api/v1');
  }

  async send_log(object_id, model, action) {
    const res = await axiosInstance.post(`/${this.url}/log`, {
      object_id,
      model,
      action
    });
    console.log('post call', res, res.data);
    return res.data;
  }
}

export const logsApi = new LogsApi();

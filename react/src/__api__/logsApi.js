import axiosInstance from 'axiosInstance';
import { user_id } from 'contexts/CookieContext';
import GeneralApi from './general';

class LogsApi extends GeneralApi {
  constructor() {
    super('logging/api/v1');
  }

  async send_log(object_id, model, action) {
    const res = await axiosInstance.post(`/${this.url}/log`, {
      user_id: user_id,
      service: "collaborative_environment_frontend",
      object_id,
      model,
      action
    });
    console.log('send log call', res, res.data);
    return res.data;
  }
}

export const logsApi = new LogsApi();

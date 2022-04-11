import axiosInstance from 'axiosInstance';
import GeneralApi from "../general";

class LogsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/logs");
  }

  async send_log(object_id, model, action) {
    const res = await axiosInstance.post(`/${this.url}`, {
      object_id,
      model,
      action
    })
    console.log('post call', res, res.data);
    return res.data
  }

}

export const logsApi = new LogsApi();

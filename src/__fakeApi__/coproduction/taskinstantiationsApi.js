import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class TaskinstantiationsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/taskinstantiations");
  }
}

export const taskinstantiationsApi = new TaskinstantiationsApi();

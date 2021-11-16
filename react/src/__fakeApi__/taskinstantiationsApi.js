import axiosInstance from '../axios';
import GeneralApi from "./general"

class TaskinstantiationsApi extends GeneralApi {
  constructor() {
    super("taskinstantiations");
  }
}

export const taskinstantiationsApi = new TaskinstantiationsApi();

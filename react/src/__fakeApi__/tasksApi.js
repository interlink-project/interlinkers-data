import axiosInstance from '../axios';
import GeneralApi from "./general"

class TasksApi extends GeneralApi {
  constructor() {
    super("tasks");
  }
}

export const tasksApi = new TasksApi();

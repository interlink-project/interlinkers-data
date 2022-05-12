import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class TasksApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/tasks');
  }
}

export const tasksApi = new TasksApi();

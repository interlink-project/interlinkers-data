import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class PermissionsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/permissions');
  }
}

export const permissionsApi = new PermissionsApi();

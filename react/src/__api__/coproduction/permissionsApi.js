import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class PermissionsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/permissions');
  }

  async for(treeitem_id) {
    if (treeitem_id) {
      const res = await axiosInstance.get(`/${this.url}/for/${treeitem_id}`);
      console.log('get permissions', res.data);
      return res.data;
    }
  }
}

export const permissionsApi = new PermissionsApi();

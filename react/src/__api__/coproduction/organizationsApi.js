import axiosInstance from 'axiosInstance';
import GeneralApi from '../general';

class OrganizationsApi extends GeneralApi {
  constructor() {
    super('coproduction/api/v1/organizations');
  }

  async getOrganizationTeams(id) {
    if (id) {
      const res = await axiosInstance.get(`/${this.url}/${id}/teams`);
      console.log('get teams of organization', res.data);
      return res.data;
    }
  }
}

export const organizationsApi = new OrganizationsApi();

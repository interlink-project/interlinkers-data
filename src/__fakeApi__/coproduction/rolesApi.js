import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class RolesApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/acl/roles");
  }

}

export const rolesApi = new RolesApi();

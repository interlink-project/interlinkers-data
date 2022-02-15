import axiosInstance from 'axiosInstance';
import GeneralApi from "../general"

class AclsApi extends GeneralApi {
  constructor() {
    super("coproduction/api/v1/acl");
  }


  async switchMembershipRole(acl_id, data) {
    const res = await axiosInstance.post(
      `/${this.url}/${acl_id}/switch_membership_role`,
      data
    );
    console.log('switch_membership_role call', res.data);
    return res.data;
  }
}

export const aclsApi = new AclsApi();

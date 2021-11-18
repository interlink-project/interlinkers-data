import axiosInstance from 'axiosInstance';

class ProblemDomainsApi {
  async getProblemDomains(skip = null, limit = null) {
    const searchparams = new URLSearchParams();
    if (skip) {
      searchparams.set('skip', skip);
    }
    if (limit) {
      searchparams.set('limit', limit);
    }
    const newparams = searchparams.toString();
    const res = await axiosInstance.get(
      `/problemdomains/${newparams ? `?${newparams}` : ''}`
    );
    console.log('getProblemDomains call', res.data);
    return res.data;
  }

  getProblemDomain(id) {
    return axiosInstance.get(`/problemdomains/${id}`).then((res) => res);
  }
}

export const problemdomainsApi = new ProblemDomainsApi();

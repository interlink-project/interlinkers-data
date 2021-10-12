import axiosInstance from '../axios';

class TeamsApi {
  async getTeams(skip = null, limit = null) {
    const searchparams = new URLSearchParams();
    if (skip) {
      searchparams.set('skip', skip);
    }
    if (limit) {
      searchparams.set('limit', limit);
    }
    const newparams = searchparams.toString();
    const res = await axiosInstance.get(
      `/teams/${newparams ? `?${newparams}` : ''}`
    );
    console.log('getTeams call', res.data);
    return res.data;
  }

  getTeam(id) {
    return axiosInstance.get(`/teams/${id}`).then((res) => res);
  }
}

export const teamsApi = new TeamsApi();

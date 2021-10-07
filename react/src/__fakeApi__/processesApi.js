import axiosInstance from '../axios';

class CoproductionProcessApi {
  async getCoproductionProcesses() {
    const res = await axiosInstance.get('/coproductionprocess/');
    console.log('getCoproductionProcesses call', res.data);
    return res.data;
  }

  getCoproductionProcess(id) {
    return axiosInstance.get(`/coproductionprocess/${id}`).then((res) => res);
  }
}

export const coproductionprocessApi = new CoproductionProcessApi();

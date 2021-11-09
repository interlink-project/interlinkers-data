import axiosInstance from '../axios';
import GeneralApi from "./general"

class CoproductionProcessesApi extends GeneralApi {
  constructor() {
    super("coproductionprocesses");
  }
}

export const coproductionProcessesApi = new CoproductionProcessesApi();

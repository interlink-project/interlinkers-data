import axiosInstance from 'axiosInstance';
import GeneralApi from "./general"

class InterlinkersApi extends GeneralApi {
  constructor() {
    super("catalogue/api/v1/interlinkers");
  }
}

export const interlinkersApi = new InterlinkersApi();

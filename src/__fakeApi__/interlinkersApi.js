import axiosInstance from 'axiosInstance';
import GeneralApi from "./general"

class InterlinkersApi extends GeneralApi {
  constructor() {
    super("interlinkers");
  }
}

export const interlinkersApi = new InterlinkersApi();

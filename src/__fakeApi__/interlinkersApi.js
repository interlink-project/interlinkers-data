import axiosInstance from '../axios';
import GeneralApi from "./general"

class InterlinkersApi extends GeneralApi {
  constructor() {
    super("interlinkers");
  }
}

export const interlinkersApi = new InterlinkersApi();

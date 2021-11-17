import axiosInstance from '../axios';
import GeneralApi from "./general"

class ObjectiveInstantiationsApi extends GeneralApi {
  constructor() {
    super("objectiveinstantiations");
  }
}

export const objectiveInstantiationsApi = new ObjectiveInstantiationsApi();

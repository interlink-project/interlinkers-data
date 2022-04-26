import GeneralApi from "../general";

class ProblemProfilesApi extends GeneralApi {
  constructor() {
    super("catalogue/api/v1/problemprofiles");
  }

}

export const problemprofilesApi = new ProblemProfilesApi();

import GeneralApi from '../general';

class SoftwareInterlinkersApi extends GeneralApi {
  constructor() {
    super('catalogue/api/v1/softwareinterlinkers');
  }
}

export const softwareInterlinkersApi = new SoftwareInterlinkersApi();

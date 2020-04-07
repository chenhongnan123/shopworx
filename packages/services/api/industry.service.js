import ApiService from './api.service';

class IndustryService {
  constructor() {
    this.request = ApiService;
  }
  
  getMasterByIndustry(id) {
    return this.request.get(`/server/masterelement/industry/${id}`);
  }

  getAssets() {
    return this.request.get(`/server/asset`);
  }
}

export default new IndustryService();

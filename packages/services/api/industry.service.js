import ApiService from './api.service';

class IndustryService {
  constructor() {
    this.request = ApiService;
  }
  
  getIndustries() {
    return this.request.get('/server/industry');
  }
  
  getMasterByIndustry(id) {
    return this.request.get(`/server/masterelement/industry/${id}`);
  }

  getAssets() {
    return this.request.get(`/server/asset`);
  }
}

export default new IndustryService();

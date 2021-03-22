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

  getModules() {
    return this.request.get(`/server/module/all`);
  }

  getReportCategories() {
    return this.request.get(`/server/reportscategory/all`);
  }
}

export default new IndustryService();

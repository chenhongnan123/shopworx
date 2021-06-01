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

  getSolutions() {
    return this.request.get(`/server/solution/all`);
  }

  getModules() {
    return this.request.get(`/server/module/all`);
  }

  getReportCategories() {
    return this.request.get(`/server/reportscategory/all`);
  }

  getInsightCategories() {
    return this.request.get(`/server/insightcategory/all`);
  }
}

export default new IndustryService();

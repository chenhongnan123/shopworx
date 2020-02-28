import ApiService from './api.service';

class IndustryService {
  constructor() {
    this.request = ApiService;
  }

  getIndustries() {
    return this.request.get('/server/industry');
  }

  createNewIndustry(data) {
    return this.request.post('/server/industry', data);
  }

  updateIndustry(id, data) {
    return this.request.put(`/server/industry/${id}`, data);
  }

  getAssets() {
    return this.request.get(`/server/asset`);
  }

  createNewAsset(data) {
    return this.request.post('/server/asset', data);
  }
  
  updateAsset(id, data) {
    return this.request.put(`/server/asset/${id}`, data);
  }

  getMasterByIndustry(id) {
    return this.request.get(`/server/masterelement/industry/${id}`);
  }

  createMasterElement(data) {
    return this.request.post('/server/masterelement', data);
  }
  
  createMasterTag(data) {
    return this.request.post('/server/mastertag', data);
  }

  updateMasterElement(id, data) {
    return this.request.put(`/server/masterelement/${id}`, data);
  }
  
  updateMasterTag(id, data) {
    return this.request.put(`/server/mastertag/${id}`, data);
  }
}

export default new IndustryService();

import ApiService from './api.service';

class ElementService {
  constructor() {
    this.request = ApiService;
  }

  createElement(data) {
    return this.request.post('/server/elements', data);
  }

  createElementTags(data) {
    return this.request.post('/server/tag/addmultiple', data);
  }

  getElement(elementName) {
    return this.request.get(`/server/elements/${elementName}`);
  }
  
  getElementsBySite(id) {
    return this.request.get(`/server/elements/site/${id}`);
  }
  
  postBulkRecords(elementName, payload) {
    return this.request.post(`/server/elements/${elementName}/createbulkrecords`, payload);
  }
  
  postRecords(elementName, payload) {
    return this.request.post(`/server/elements/${elementName}/records`, payload);
  }
  
  getRecords(elementName) {
    return this.request.get(`/server/elements/${elementName}/records`);
  }
}

export default new ElementService();

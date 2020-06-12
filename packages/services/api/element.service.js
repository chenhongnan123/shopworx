import ApiService from './api.service';

class ElementService {
  constructor() {
    this.request = ApiService;
  }

  getElement(elementName) {
    return this.request.get(`/server/elements/${elementName}`);
  }
  
  getElementsBySite(id) {
    return this.request.get(`/server/elements/site/${id}`);
  }

  createElement(payload) {
    return this.request.post('/server/elements', payload);
  }

  createElementTags(data) {
    return this.request.post('/server/tag/addmultiple', data);
  }
  
  postBulkRecords(elementName, payload) {
    return this.request.post(`/server/elements/${elementName}/createbulkrecords`, payload);
  }
  
  postRecord(elementName, payload) {
    return this.request.post(`/server/elements/${elementName}/records`, payload);
  }
  
  getRecords(elementName, queryParam) {
    return this.request.get(`/server/elements/${elementName}/records${queryParam}`);
  }
  
  deleteRecordById(elementName, id) {
    return this.request.delete(`/server/elements/${elementName}/records/${id}`);
  }
  
  deleteRecordByQuery(elementName, queryParam) {
    return this.request.delete(`/server/elements/${elementName}/records${queryParam}`);
  }
  
  updateRecordById(elementName, id, payload) {
    return this.request.put(`/server/elements/${elementName}/records/${id}`, payload);
  }
  
  updateRecordByQuery(elementName, queryParam, payload) {
    return this.request.put(`/server/elements/${elementName}/records${queryParam}`, payload);
  }

  postSocket(functionName, postData) {
    return this.request.post(`/socket.io/linemes/${functionName}`, postData);
  }
}

export default new ElementService();
